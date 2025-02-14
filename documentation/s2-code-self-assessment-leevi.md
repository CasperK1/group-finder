# Self-Assessment

## Most used elements used for pages in CSS
```css

display: flex;
flex-wrap: wrap;
justify-content: 
align-items:

```
## Optimizing Sidebar Visibility

**Issue:** The sidebar was always visible, taking up space on all pages. Only needed in homepage

```javascript
function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-layout">
        <Sidebar />
        <Routes> {/* Content here */} </Routes>
      </div>
    </div>
  );
}
```

**Solution:** Adjusted sidebar visibility dynamically based on the route.

```javascript
function Layout() {
  const isGroupsPage = useLocation().pathname === "/";
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-layout">
        {isGroupsPage && <Sidebar />}
        <Routes> {/* Content here */} </Routes>
      </div>
    </div>
  );
}
```

**Lesson Learned:** Manage layout components dynamically to improve user experience.

---

## Enhancing Navbar UX

**Issue:** The navbar did not provide active page feedback.

```css
.nav-link { color: black; transition: color 0.3s; }
.nav-link:hover { color: blue; }
```

**Solution:** Added an animated underline to indicate active pages.

```css
.nav-link::after {
  content: ""; position: absolute; width: 100%; height: 2px;
  background: blue; transform: scaleX(0); transition: transform 0.3s;
}
.nav-link:hover::after { transform: scaleX(1); }
```

**Lesson Learned:** Small visual cues improve navigation clarity.

---

## Successes & Areas for Improvement

**Successes:**
- Creating the pages for the project that look ok for now.
- Making the UI look like in the Figma template

**Areas for Improvement:**
- Further optimize CSS.
- More refined outlook of the pages.
- User-friendly + responsive features



