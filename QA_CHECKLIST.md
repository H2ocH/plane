# QA Checklist: AI Trip Planner UI Verification

**Objective:** Ensure the application meets high standards for visual consistency, accessibility, responsiveness, and robustness across various devices and conditions.

---

### 1. Spacing & Typography

-   [ ] **Spacing Scale:** Verify that margins, paddings, and gaps use a consistent scale (e.g., Tailwind's `p-4`, `p-6`, `space-y-6`).
    -   **Test Case:** Inspect the `Planner` form fields and the cards within the `Itinerary` view. Ensure spacing is rhythmic and predictable.
-   [ ] **Font Sizes:** Confirm a logical and consistent typographic hierarchy.
    -   **Test Case:** Check `h1`, `h2`, `h3`, and body text across `Header`, `Planner`, and `Itinerary` components. The main `Planner` title (`text-3xl`) is larger than the `Header` title (`text-2xl`); confirm if this is the intended hierarchy.
-   [ ] **Font Families:** Ensure all headings render in 'Playfair Display' and all other text renders in 'Inter' as specified in `index.html`.

---

### 2. Accessibility (A11y)

-   [ ] **Color Contrast:** Use browser dev tools to ensure all text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
    -   **Test Case:** Check `text-white` on `bg-blue-600` buttons.
    -   **Test Case:** Check `text-gray-500` (e.g., "Duration (days)") on white/gray backgrounds.
    -   **Test Case:** Check `text-red-700` on `bg-red-50` in the `ErrorState` component.
-   [ ] **Focus Outlines:** Tab through every interactive element. A clear, visible focus ring (e.g., Tailwind's `focus:ring-blue-500`) must be present.
    -   **Test Case:** Navigate through the entire `Login` and `Planner` forms using only the Tab key.
    -   **Test Case:** Tab through the trip list and delete buttons in the `Dashboard`.
-   [ ] **Focus Management:** When a dialog or modal is open, ensure focus is trapped within it.
    -   **Test Case:** Open the "Confirm Deletion" `Dialog`. Pressing Tab should cycle through "Cancel" and "Delete" buttons only. Pressing `Escape` should close the dialog.
-   [ ] **Keyboard Navigation:** Confirm all functionality is accessible via keyboard.
    -   **Test Case:** Successfully log in, generate a new trip, select a trip from the list, and delete a trip using only Enter, Space, Tab, and arrow keys.

---

### 3. Interaction States (Hover, Focus, Disabled)

-   [ ] **Hover States:** Hover the mouse over all interactive elements. A distinct visual change must occur.
    -   **Test Case:** Hover over buttons (`hover:bg-blue-700`), trip list items (`hover:bg-gray-100`), and delete icons (`hover:bg-red-100`).
-   [ ] **Focus States:** Ensure the visual state for keyboard focus is as clear as the hover state.
-   [ ] **Disabled States:** Verify that buttons are visually and functionally disabled during loading states.
    -   **Test Case:** Click "Create My Trip." The button should display "Generating..." and become unclickable, with the `disabled:bg-blue-300` style applied.

---

### 4. Responsive Design (Breakpoints 320px – 1440px)

-   [ ] **Mobile (320px - 767px):**
    -   **Test Case:** Confirm no horizontal scrollbars appear.
    -   **Test Case:** The `Dashboard` layout should stack into a single column.
    -   **Test Case:** The `Itinerary` view's flight/hotel suggestions and restaurant cards should stack vertically.
    -   **Test Case:** Ensure form inputs and buttons are large enough for easy tapping.
-   [ ] **Tablet (768px - 1023px):**
    -   **Test Case:** Verify the `Planner` form's "Duration" and "Budget" fields switch to a two-column grid (`md:grid-cols-2`).
    -   **Test Case:** Verify the `Itinerary` flight/hotel section uses its two-column grid.
-   [ ] **Desktop (1024px+):**
    -   **Test Case:** Confirm the main `Dashboard` layout displays the trip list sidebar (`lg:col-span-3`) next to the main itinerary view (`lg:col-span-9`).
    -   **Test Case:** At 1440px, check that content remains contained within the `container mx-auto` and does not become excessively wide.

---

### 5. Internationalization & Right-to-Left (RTL) Support

-   [ ] **RTL Simulation:** In browser dev tools, add `dir="rtl"` to the `<html>` element.
-   [ ] **Layout Flipping:** Verify that layouts mirror correctly.
    -   **Test Case:** The `Dashboard` sidebar should appear on the right.
    -   **Test Case:** The `Header`'s logo/title should be on the right, and user info/logout on the left.
    -   **Test Case:** The `Dashboard` trip list buttons have `text-left`. In RTL, this text should be right-aligned.
-   [ ] **Iconography:** Check if directional icons still make sense. (The current icon set is mostly symmetrical and should be fine).

---

### 6. Dark Mode Edge Cases

*Instructions: To test, manually edit the CSS variables in the `<style>` tag of `index.html` within your browser's dev tools to a dark theme palette.*

**Example Dark Theme Palette:**
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 47.4% 11.2%;
  --secondary: 222.2 47.4% 11.2%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
}
```

-   [ ] **Inputs & Placeholders:**
    -   **Test Case:** In the `Login` and `Planner` forms, ensure `input`, `select`, and `checkbox` backgrounds change and their text/borders are clearly visible against the dark background.
    -   **Test Case:** Verify that placeholder text (`placeholder-gray-400`) is legible. It may need a lighter color for dark mode.
-   [ ] **Browser Autofill:**
    -   **Test Case:** Trigger Chrome's autofill on the login form. Check if the default blue/yellow background creates an unreadable or jarring visual clash with the dark theme text and inputs.
-   [ ] **Shadows & Borders:**
    -   **Test Case:** Inspect cards and dialogs. Are the `shadow-lg` and `border` styles still visible, or do they disappear against the dark background?
-   [ ] **SVGs:**
    -   **Test Case:** Check all icons. Their `stroke="currentColor"` implementation should make them adapt correctly, but verify they have sufficient contrast.
