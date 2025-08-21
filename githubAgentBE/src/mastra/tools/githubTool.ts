import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Octokit } from "@octokit/rest";
import { logger } from "../../utils/logger";
export const githubTool = createTool({
  id: "github_comprehensive_tool",
  description: "Comprehensive GitHub operations tool for repositories, issues, PRs, files, commits, branches, and more",
  inputSchema: z.object({
    operation: z.enum([
      "get_repo", "list_issues", "create_issue", "get_file",
      "list_commits", "create_pr", "list_prs",
      "create_file", "update_file", "delete_file", "list_directory",
      "list_branches", "create_branch", "delete_branch", "get_branch",
      "close_issue", "update_issue",
      "merge_pr",
      "list_collaborators", "add_collaborator", "remove_collaborator",
      "get_repo_stats", "list_releases", "create_release",
      "fork_repo", "star_repo", "unstar_repo", "watch_repo",
      "search_code", "search_issues",
      "get_commit", "compare_commits"
    ]),
    owner: z.string().describe("Repository owner name"),
    repo: z.string().describe("Repository name"),
    issue_number: z.number().optional().describe("Issue number for issue-specific operations"),
    path: z.string().optional().describe("File path for file operations"),
    title: z.string().optional().describe("Title for issues/PRs/releases"),
    body: z.string().optional().describe("Body/description for issues/PRs/releases"),
    head: z.string().optional().describe("Source branch for PR"),
    base: z.string().optional().describe("Target branch for PR (default: main)"),
    content: z.string().optional().describe("File content for file operations"),
    message: z.string().optional().describe("Commit message for file operations"),
    branch: z.string().optional().describe("Branch name for branch operations"),
    sha: z.string().optional().describe("SHA for file operations or commit references"),
    username: z.string().optional().describe("Username for collaborator operations"),
    permission: z.enum(["pull", "push", "admin", "maintain", "triage"]).optional().describe("Permission level for collaborators"),
    state: z.enum(["open", "closed"]).optional().describe("State for issues/PRs"),
    tag_name: z.string().optional().describe("Tag name for releases"),
    target_commitish: z.string().optional().describe("Target commitish for releases"),
    draft: z.boolean().optional().describe("Whether release is draft"),
    prerelease: z.boolean().optional().describe("Whether release is prerelease"),
    query: z.string().optional().describe("Search query"),
    pr_number: z.number().optional().describe("Pull request number"),
    commit_sha: z.string().optional().describe("Commit SHA for specific operations"),
    base_sha: z.string().optional().describe("Base SHA for comparisons"),
  }),
  outputSchema: z.object({
    operation: z.string(),
    success: z.boolean(),
    message: z.string().optional(),
    count: z.number().optional(),
    data: z.any(),
  }),
  execute: async ({ context, runtimeContext }) => {
    const githubToken = runtimeContext.get("githubToken") as string;
    logger.info("GitHub operation:", context.operation);
    if (!githubToken) {
      throw new Error("GitHub token not found in runtime context");
    }
    const octokit = new Octokit({ auth: githubToken });
    try {
      switch (context.operation) {
        case "get_repo": {
          const { data } = await octokit.repos.get({
            owner: context.owner,
            repo: context.repo,
          });
          return {
            operation: context.operation,
            success: true,
            message: "Repository information retrieved successfully",
            data: {
              id: data.id,
              node_id: data.node_id,
              owner: data.owner.login,
              html_url: data.html_url,
              name: data.name,
              full_name: data.full_name,
              private: data.private,
              description: data.description ?? "",
              fork: data.fork,
              language: data.language,
              stargazers_count: data.stargazers_count,
              forks_count: data.forks_count,
              open_issues_count: data.open_issues_count,
              default_branch: data.default_branch,
              created_at: data.created_at,
              updated_at: data.updated_at,
            }
          };
        }
        case "list_issues": {
          const { data: issues } = await octokit.issues.listForRepo({
            owner: context.owner,
            repo: context.repo,
            state: "all",
            per_page: 50,
          });
          const processedIssues = issues.map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            html_url: issue.html_url,
            user: {
              login: issue.user?.login ?? "unknown",
              html_url: issue.user?.html_url ?? "",
            },
            labels: issue.labels.map(label => ({
              name: typeof label === "string" ? label : label.name ?? "",
              color: typeof label === "string" ? "" : label.color ?? "",
            })),
            created_at: issue.created_at,
            updated_at: issue.updated_at,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${issues.length} issues`,
            count: issues.length,
            data: processedIssues,
          };
        }
        case "create_issue": {
          if (!context.title) {
            throw new Error("Title is required for create_issue operation");
          }
          const { data: newIssue } = await octokit.issues.create({
            owner: context.owner,
            repo: context.repo,
            title: context.title,
            body: context.body ?? "",
          });
          return {
            operation: context.operation,
            success: true,
            message: `Issue #${newIssue.number} created successfully`,
            data: {
              id: newIssue.id,
              number: newIssue.number,
              title: newIssue.title,
              body: newIssue.body,
              html_url: newIssue.html_url,
              state: newIssue.state,
              user: {
                login: newIssue.user?.login ?? "unknown",
              },
            },
          };
        }
        case "get_file": {
          if (!context.path) {
            throw new Error("Path is required for get_file operation");
          }
          const { data: fileData } = await octokit.repos.getContent({
            owner: context.owner,
            repo: context.repo,
            path: context.path,
          });
          if (Array.isArray(fileData)) {
            throw new Error("Path points to a directory, not a file");
          }
          if (fileData.type !== "file") {
            throw new Error("Path does not point to a file");
          }
          return {
            operation: context.operation,
            success: true,
            message: `File content retrieved: ${fileData.name}`,
            data: {
              name: fileData.name,
              path: fileData.path,
              content: fileData.content ?? "",
              encoding: fileData.encoding ?? "base64",
              size: fileData.size,
              sha: fileData.sha,
              download_url: fileData.download_url,
              type: fileData.type,
            },
          };
        }
        case "list_commits": {
          const { data: commits } = await octokit.repos.listCommits({
            owner: context.owner,
            repo: context.repo,
            per_page: 20,
          });
          const processedCommits = commits.map(commit => ({
            sha: commit.sha,
            commit: {
              message: commit.commit.message,
              author: {
                name: commit.commit.author?.name ?? "unknown",
                email: commit.commit.author?.email ?? "",
                date: commit.commit.author?.date ?? "",
              },
              committer: {
                name: commit.commit.committer?.name ?? "unknown",
                email: commit.commit.committer?.email ?? "",
                date: commit.commit.committer?.date ?? "",
              },
            },
            html_url: commit.html_url,
            author: commit.author ? {
              login: commit.author.login,
              html_url: commit.author.html_url,
            } : null,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Retrieved ${commits.length} commits`,
            count: commits.length,
            data: processedCommits,
          };
        }
        case "list_prs": {
          const { data: prs } = await octokit.pulls.list({
            owner: context.owner,
            repo: context.repo,
            state: "all",
            per_page: 50,
          });
          const processedPRs = prs.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            body: pr.body,
            state: pr.state,
            html_url: pr.html_url,
            user: {
              login: pr.user?.login ?? "unknown",
              html_url: pr.user?.html_url ?? "",
            },
            head: {
              ref: pr.head.ref,
              sha: pr.head.sha,
              repo: pr.head.repo ? {
                name: pr.head.repo.name,
                full_name: pr.head.repo.full_name,
              } : null,
            },
            base: {
              ref: pr.base.ref,
              sha: pr.base.sha,
            },
            created_at: pr.created_at,
            updated_at: pr.updated_at,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${prs.length} pull requests`,
            count: prs.length,
            data: processedPRs,
          };
        }
        case "create_pr": {
          if (!context.title) {
            throw new Error("Title is required for create_pr operation");
          }
          if (!context.head) {
            throw new Error("Head branch is required for create_pr operation");
          }
          const { data: newPR } = await octokit.pulls.create({
            owner: context.owner,
            repo: context.repo,
            title: context.title,
            body: context.body ?? "",
            head: context.head,
            base: context.base ?? "main",
          });
          return {
            operation: context.operation,
            success: true,
            message: `Pull request #${newPR.number} created successfully`,
            data: {
              id: newPR.id,
              number: newPR.number,
              title: newPR.title,
              body: newPR.body,
              html_url: newPR.html_url,
              state: newPR.state,
              head: {
                ref: newPR.head.ref,
                sha: newPR.head.sha,
              },
              base: {
                ref: newPR.base.ref,
                sha: newPR.base.sha,
              },
            },
          };
        }
        case "create_file": {
          if (!context.path) {
            throw new Error("Path is required for create_file operation");
          }
          if (!context.content) {
            throw new Error("Content is required for create_file operation");
          }
          if (!context.message) {
            throw new Error("Commit message is required for create_file operation");
          }
          const { data } = await octokit.repos.createOrUpdateFileContents({
            owner: context.owner,
            repo: context.repo,
            path: context.path,
            message: context.message,
            content: Buffer.from(context.content).toString('base64'),
            branch: context.branch,
          });
          return {
            operation: context.operation,
            success: true,
            message: `File created successfully: ${context.path}`,
            data: {
              content: data.content,
              commit: data.commit,
            },
          };
        }
        case "update_file": {
          if (!context.path) {
            throw new Error("Path is required for update_file operation");
          }
          if (!context.content) {
            throw new Error("Content is required for update_file operation");
          }
          if (!context.message) {
            throw new Error("Commit message is required for update_file operation");
          }
          if (!context.sha) {
            throw new Error("SHA is required for update_file operation");
          }
          const { data } = await octokit.repos.createOrUpdateFileContents({
            owner: context.owner,
            repo: context.repo,
            path: context.path,
            message: context.message,
            content: Buffer.from(context.content).toString('base64'),
            sha: context.sha,
            branch: context.branch,
          });
          return {
            operation: context.operation,
            success: true,
            message: `File updated successfully: ${context.path}`,
            data: {
              content: data.content,
              commit: data.commit,
            },
          };
        }
        case "delete_file": {
          if (!context.path) {
            throw new Error("Path is required for delete_file operation");
          }
          if (!context.message) {
            throw new Error("Commit message is required for delete_file operation");
          }
          if (!context.sha) {
            throw new Error("SHA is required for delete_file operation");
          }
          const { data } = await octokit.repos.deleteFile({
            owner: context.owner,
            repo: context.repo,
            path: context.path,
            message: context.message,
            sha: context.sha,
            branch: context.branch,
          });
          return {
            operation: context.operation,
            success: true,
            message: `File deleted successfully: ${context.path}`,
            data: {
              commit: data.commit,
            },
          };
        }
        case "list_directory": {
          if (!context.path) {
            throw new Error("Path is required for list_directory operation");
          }
          const { data } = await octokit.repos.getContent({
            owner: context.owner,
            repo: context.repo,
            path: context.path,
          });
          if (!Array.isArray(data)) {
            throw new Error("Path does not point to a directory");
          }
          const processedItems = data.map(item => ({
            name: item.name,
            path: item.path,
            type: item.type,
            size: item.size,
            sha: item.sha,
            download_url: item.download_url,
            html_url: item.html_url,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Directory contents retrieved: ${data.length} items`,
            count: data.length,
            data: processedItems,
          };
        }
        case "list_branches": {
          const { data: branches } = await octokit.repos.listBranches({
            owner: context.owner,
            repo: context.repo,
            per_page: 100,
          });
          const processedBranches = branches.map(branch => ({
            name: branch.name,
            commit: {
              sha: branch.commit.sha,
              url: branch.commit.url,
            },
            protected: branch.protected,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${branches.length} branches`,
            count: branches.length,
            data: processedBranches,
          };
        }
        case "create_branch": {
          if (!context.branch) {
            throw new Error("Branch name is required for create_branch operation");
          }
          if (!context.sha) {
            throw new Error("SHA is required for create_branch operation");
          }
          const { data } = await octokit.git.createRef({
            owner: context.owner,
            repo: context.repo,
            ref: `refs/heads/${context.branch}`,
            sha: context.sha,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Branch created successfully: ${context.branch}`,
            data: {
              ref: data.ref,
              node_id: data.node_id,
              url: data.url,
              object: data.object,
            },
          };
        }
        case "delete_branch": {
          if (!context.branch) {
            throw new Error("Branch name is required for delete_branch operation");
          }
          await octokit.git.deleteRef({
            owner: context.owner,
            repo: context.repo,
            ref: `heads/${context.branch}`,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Branch deleted successfully: ${context.branch}`,
            data: null,
          };
        }
        case "get_branch": {
          if (!context.branch) {
            throw new Error("Branch name is required for get_branch operation");
          }
          const { data } = await octokit.repos.getBranch({
            owner: context.owner,
            repo: context.repo,
            branch: context.branch,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Branch information retrieved: ${context.branch}`,
            data: {
              name: data.name,
              commit: {
                sha: data.commit.sha,
                node_id: data.commit.node_id,
                commit: {
                  message: data.commit.commit.message,
                  author: data.commit.commit.author,
                  committer: data.commit.commit.committer,
                },
              },
              protected: data.protected,
            },
          };
        }
        case "close_issue": {
          if (!context.issue_number) {
            throw new Error("Issue number is required for close_issue operation");
          }
          const { data } = await octokit.issues.update({
            owner: context.owner,
            repo: context.repo,
            issue_number: context.issue_number,
            state: "closed",
          });
          return {
            operation: context.operation,
            success: true,
            message: `Issue #${context.issue_number} closed successfully`,
            data: {
              id: data.id,
              number: data.number,
              state: data.state,
              title: data.title,
            },
          };
        }
        case "update_issue": {
          if (!context.issue_number) {
            throw new Error("Issue number is required for update_issue operation");
          }
          const updateData: any = {
            owner: context.owner,
            repo: context.repo,
            issue_number: context.issue_number,
          };
          if (context.title) updateData.title = context.title;
          if (context.body) updateData.body = context.body;
          if (context.state) updateData.state = context.state;
          const { data } = await octokit.issues.update(updateData);
          return {
            operation: context.operation,
            success: true,
            message: `Issue #${context.issue_number} updated successfully`,
            data: {
              id: data.id,
              number: data.number,
              title: data.title,
              body: data.body,
              state: data.state,
            },
          };
        }
        case "merge_pr": {
          if (!context.pr_number) {
            throw new Error("PR number is required for merge_pr operation");
          }
          const { data } = await octokit.pulls.merge({
            owner: context.owner,
            repo: context.repo,
            pull_number: context.pr_number,
            commit_message: context.message,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Pull request #${context.pr_number} merged successfully`,
            data: {
              sha: data.sha,
              merged: data.merged,
              message: data.message,
            },
          };
        }
        case "list_collaborators": {
          const { data: collaborators } = await octokit.repos.listCollaborators({
            owner: context.owner,
            repo: context.repo,
          });
          const processedCollaborators = collaborators.map(collaborator => ({
            login: collaborator.login,
            id: collaborator.id,
            node_id: collaborator.node_id,
            avatar_url: collaborator.avatar_url,
            html_url: collaborator.html_url,
            permissions: collaborator.permissions,
            role_name: collaborator.role_name,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${collaborators.length} collaborators`,
            count: collaborators.length,
            data: processedCollaborators,
          };
        }
        case "add_collaborator": {
          if (!context.username) {
            throw new Error("Username is required for add_collaborator operation");
          }
          await octokit.repos.addCollaborator({
            owner: context.owner,
            repo: context.repo,
            username: context.username,
            permission: context.permission || "push",
          });
          return {
            operation: context.operation,
            success: true,
            message: `Collaborator ${context.username} added successfully`,
            data: {
              username: context.username,
              permission: context.permission || "push",
            },
          };
        }
        case "get_repo_stats": {
          const [contributors, languages, traffic] = await Promise.allSettled([
            octokit.repos.listContributors({
              owner: context.owner,
              repo: context.repo,
            }),
            octokit.repos.listLanguages({
              owner: context.owner,
              repo: context.repo,
            }),
            octokit.repos.getClones({
              owner: context.owner,
              repo: context.repo,
            }).catch(() => null),
          ]);
          const stats: any = {};
          if (contributors.status === 'fulfilled') {
            stats.contributors = contributors.value.data.map(c => ({
              login: c.login,
              contributions: c.contributions,
              avatar_url: c.avatar_url,
              html_url: c.html_url,
            }));
            stats.contributor_count = contributors.value.data.length;
          }
          if (languages.status === 'fulfilled') {
            stats.languages = languages.value.data;
          }
          if (traffic.status === 'fulfilled' && traffic.value) {
            stats.clones = traffic.value.data;
          }
          return {
            operation: context.operation,
            success: true,
            message: "Repository statistics retrieved",
            data: stats,
          };
        }
        case "list_releases": {
          const { data: releases } = await octokit.repos.listReleases({
            owner: context.owner,
            repo: context.repo,
            per_page: 50,
          });
          const processedReleases = releases.map(release => ({
            id: release.id,
            tag_name: release.tag_name,
            name: release.name,
            body: release.body,
            draft: release.draft,
            prerelease: release.prerelease,
            created_at: release.created_at,
            published_at: release.published_at,
            html_url: release.html_url,
            author: release.author ? {
              login: release.author.login,
              html_url: release.author.html_url,
            } : null,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${releases.length} releases`,
            count: releases.length,
            data: processedReleases,
          };
        }
        case "create_release": {
          if (!context.tag_name) {
            throw new Error("Tag name is required for create_release operation");
          }
          const { data } = await octokit.repos.createRelease({
            owner: context.owner,
            repo: context.repo,
            tag_name: context.tag_name,
            name: context.title || context.tag_name,
            body: context.body || "",
            draft: context.draft || false,
            prerelease: context.prerelease || false,
            target_commitish: context.target_commitish,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Release ${context.tag_name} created successfully`,
            data: {
              id: data.id,
              tag_name: data.tag_name,
              name: data.name,
              html_url: data.html_url,
              draft: data.draft,
              prerelease: data.prerelease,
            },
          };
        }
        case "search_code": {
          if (!context.query) {
            throw new Error("Query is required for search_code operation");
          }
          const { data } = await octokit.search.code({
            q: `${context.query} repo:${context.owner}/${context.repo}`,
          });
          const processedResults = data.items.map(item => ({
            name: item.name,
            path: item.path,
            sha: item.sha,
            html_url: item.html_url,
            repository: {
              name: item.repository.name,
              full_name: item.repository.full_name,
            },
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${data.total_count} code results`,
            count: data.total_count,
            data: processedResults,
          };
        }
        case "search_issues": {
          if (!context.query) {
            throw new Error("Query is required for search_issues operation");
          }
          const { data } = await octokit.search.issuesAndPullRequests({
            q: `${context.query} repo:${context.owner}/${context.repo}`,
          });
          const processedResults = data.items.map(item => ({
            id: item.id,
            number: item.number,
            title: item.title,
            state: item.state,
            html_url: item.html_url,
            user: item.user ? {
              login: item.user.login,
              html_url: item.user.html_url,
            } : null,
            labels: item.labels?.map(label => ({
              name: typeof label === "string" ? label : label.name,
              color: typeof label === "string" ? "" : label.color,
            })) || [],
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));
          return {
            operation: context.operation,
            success: true,
            message: `Found ${data.total_count} issue/PR results`,
            count: data.total_count,
            data: processedResults,
          };
        }
        case "get_commit": {
          if (!context.commit_sha) {
            throw new Error("Commit SHA is required for get_commit operation");
          }
          const { data } = await octokit.repos.getCommit({
            owner: context.owner,
            repo: context.repo,
            ref: context.commit_sha,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Commit information retrieved: ${context.commit_sha}`,
            data: {
              sha: data.sha,
              node_id: data.node_id,
              html_url: data.html_url,
              commit: {
                message: data.commit.message,
                author: data.commit.author,
                committer: data.commit.committer,
                tree: data.commit.tree,
              },
              author: data.author ? {
                login: data.author.login,
                html_url: data.author.html_url,
              } : null,
              committer: data.committer ? {
                login: data.committer.login,
                html_url: data.committer.html_url,
              } : null,
              files: data.files?.map(file => ({
                filename: file.filename,
                additions: file.additions,
                deletions: file.deletions,
                changes: file.changes,
                status: file.status,
                patch: file.patch,
              })),
              stats: data.stats,
            },
          };
        }
        case "compare_commits": {
          if (!context.base_sha || !context.sha) {
            throw new Error("Both base SHA and head SHA are required for compare_commits operation");
          }
          const { data } = await octokit.repos.compareCommits({
            owner: context.owner,
            repo: context.repo,
            base: context.base_sha,
            head: context.sha,
          });
          return {
            operation: context.operation,
            success: true,
            message: `Comparison completed between ${context.base_sha} and ${context.sha}`,
            data: {
              status: data.status,
              ahead_by: data.ahead_by,
              behind_by: data.behind_by,
              total_commits: data.total_commits,
              html_url: data.html_url,
              commits: data.commits.map(commit => ({
                sha: commit.sha,
                commit: {
                  message: commit.commit.message,
                  author: commit.commit.author,
                },
                author: commit.author ? {
                  login: commit.author.login,
                  html_url: commit.author.html_url,
                } : null,
              })),
              files: data.files?.map(file => ({
                filename: file.filename,
                additions: file.additions,
                deletions: file.deletions,
                changes: file.changes,
                status: file.status,
              })),
            },
          };
        }
        default:
          throw new Error(`Unsupported operation: ${context.operation}`);
      }
    } catch (error) {
      logger.error("GitHub API error:", error);
      return {
        operation: context.operation,
        success: false,
        message: `GitHub operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null,
      };
    }
  },
});
export { githubTool as getRepoTool };