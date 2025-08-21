# V0 Prompt: GitHub Research Assistant Frontend

Create a modern, metallic GitHub-themed research assistant chat application with the following specifications:

## 🎨 Design Requirements

**Theme & Style:**
- Metallic, sleek GitHub-inspired design with dark mode aesthetic
- Color palette: Dark grays (#0d1117, #161b22, #21262d), GitHub blue (#2188ff), silver metallic accents (#f0f6fc)
- Clean, minimal interface with subtle gradients and shadows
- GitHub Primer design system inspiration
- Responsive design for desktop and mobile

**Visual Elements:**
- Metallic finish with subtle gradients and reflections
- GitHub-style rounded corners (6px border radius)
- Elegant shadows and depth
- Smooth animations and transitions
- GitHub iconography (Octocat, repo icons, etc.)

## 🔧 Functional Requirements

### Authentication Flow
1. **Login Page**: Clean GitHub OAuth login button with loading states
2. **Auth Guard**: Protect chat routes, redirect to login if not authenticated
3. **User Profile**: Display GitHub avatar, username, and basic info in header

### Chat Interface
1. **Message History**: Scrollable chat container with auto-scroll to bottom
2. **Input System**: 
   - Multi-line text input with auto-resize
   - Send button with loading spinner
   - Enter to send, Shift+Enter for new line
3. **Message Types**:
   - User messages: Right-aligned, GitHub blue background
   - Assistant messages: Left-aligned, dark background with metallic accent
   - System messages: Centered, subtle styling
4. **Typing Indicator**: Animated dots when assistant is responding
5. **Error Handling**: Toast notifications for errors

### Additional Features
- **Clear Chat**: Button to reset conversation
- **Export Chat**: Download conversation as markdown
- **Logout**: Clean logout with confirmation
- **Responsive**: Mobile-first design

## 📱 Component Structure
