# Self-Assessment: Leevi

## Responsive Tailwind Elements

All of normal CSS transitioned to Tailwind CSS, more responsive and simple than before. Key practices include:

- **Flex & Grid Layouts:** Utilizing utilities like `flex`, `flex-wrap`, and `justify-between` to create fluid layouts.
- **Conditional Rendering:** Leveraging responsive classes such as `hidden lg:flex` to show or hide elements based on screen size.

Below is an example of using Tailwind CSS with custom styles:

```css
/* Example Tailwind CSS using @apply */
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition;
}

.container {
  @apply flex flex-wrap justify-center items-center p-4;
}

### Optimizing Sidebar Visibility
Issue: The sidebar was always visible, taking up valuable space on every page.
Solution: Conditionally render the sidebar based on the current route.

```javascript
function Layout() {
  const isHomePage = useLocation().pathname === "/";
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-layout flex">
        {isHomePage && <Sidebar />}
        <Routes>{/* Page content goes here */}</Routes>
      </div>
    </div>
  );
}
```
Lesson Learned: Dynamically managing layout components can improve both aesthetics and usability.

Enhancing Navbar UX with a Responsive Hamburger Menu
Issue: Navigation did not adapt well to mobile devices.
Solution: Implement a hamburger menu that toggles mobile navigation with smooth animations.

```javascript
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="w-full bg-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 cursor-pointer" />
        </Link>
        {/* Hamburger Menu Button */}
        <button className="lg:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <span className="text-2xl">✖</span> : <span className="text-2xl">☰</span>}
        </button>
        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-8">
          {['/', '/your-groups', '/about'].map((path, index) => (
            <li key={index} className="relative group">
              <Link
                to={path}
                className="text-gray-800 font-semibold hover:text-blue-500 transition duration-300"
              >
                {path === '/' ? 'Groups' : path === '/your-groups' ? 'Your Groups' : 'About'}
              </Link>
              <span className="absolute left-0 bottom-[-4px] h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden absolute top-16 right-0 w-32 bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 text-right z-50 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[-10px] pointer-events-none'
        }`}
      >
        <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-800 font-semibold hover:text-blue-500">
          Groups
        </Link>
        <Link to="/your-groups" onClick={() => setIsOpen(false)} className="text-gray-800 font-semibold hover:text-blue-500">
          Your Groups
        </Link>
        <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-800 font-semibold hover:text-blue-500">
          About
        </Link>
      </div>
    </nav>
  );
}
```
Lesson Learned: A well-implemented responsive menu enhances mobile usability and ensures smooth transitions between device sizes.

###  Toastify Integration Example in Signup Flow
For improved user feedback during signup, we integrated react-toastify to display toast notifications. This provides immediate confirmation or error messages.

```javascript
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const handleSignup = async (data) => {
    try {
      // Signup API call...
      toast.success("Signup successful!");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Signup Form */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
```

Lesson Learned: Integrating Toastify enhances the user experience by providing real-time feedback without cluttering the interface.

## Successes & Areas for Improvement during sprint 3
Successes:

Fully adopted Tailwind CSS for a cleaner, more responsive design.
Improved UI elements such as the navbar and sidebar for better device adaptability.
Enhanced user feedback with react-toastify during the signup process.

Areas for Improvement:

As I did frontend the backend of our project isn't as well learned compared to frontend. So I will need to improve my backend knowledge more.