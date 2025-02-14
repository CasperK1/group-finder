# Self-Assessment

## Using React Hook Form to manage the login form input

**Issue:** Managing input fields and validation became complex as the form grew. It was hard to control all the state changes for each field.

```javascript

    const handlePasswordChange = (e) => {
      setValue("password", e.target.value);
    };

    <input
      type="password"
      placeholder="Enter your password"
      className="border p-2 rounded placeholder:text-xs"
      onChange={handlePasswordChange}
    />;
```

**Solution:** I used React Hook Form to manage the entire form state, simplifying validation and state changes, while rendering child components as dummy components that only display form values without managing state. The parent component handles all form logic, including validation, input values, and submission.

```javascript
    <Controller
      name="password"
      control={control}
      rules={{
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters long',
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
      }}
```

**Lesson Learned:** React Hook Form simplifies form management by centralizing logic, improving validation, optimizing performance, and keeping the code clean with dummy components that only display values.

---

## Using Axios libary for communication with the server

**Issue:** fetch requires manual JSON parsing, and has more complex syntax for things like custom headers

```javascript
    const response = await fetch(apiRegisterURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
```

**Solution:** Use Axios for simpler syntax and automatic JSON parsing.

```javascript
    const response = await axios.post(apiRegisterURL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
```

**Lesson Learned:** Using Axios simplifies HTTP requests by automatically parsing JSON responses and offering a cleaner syntax for things like custom headers and request bodies, reducing the complexity compared to using fetch.

---

## Successes & Areas for Improvement

**Successes:**

- Simplified form management with React Hook Form, making validation and state handling easier.
- Improved API communication with Axios, reducing complexity and eliminating manual JSON parsing.

**Areas for Improvement:**

- Improve global error handling for APIs to manage errors more effectively.
- Make form components more reusable to avoid code duplication.

