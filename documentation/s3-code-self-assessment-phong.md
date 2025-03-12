# Sprint3 Self-Assessment (Phong)

## Using React Hook Form to manage the login form input

**Issue:** We have a state that needs to be accessed and used across many components in the application. The main challenge we face is that, as the number of components grows, we need to pass this state down through props in a deep component tree. This becomes cumbersome, error-prone, and difficult to maintain, especially when changes in the state need to be reflected across multiple parts of the application.


**Solution:** With Redux, we store the shared state in a global store and manage it in a single location, making it accessible from any component without the need for prop drilling. The state can be updated easily and the changes will be reflected throughout the app immediately.
Configure the Redux store by combining multiple reducers.

```javascript
export const store = configureStore({
  reducer: {
    profilePicture: profilePictureSlice.reducer,
    userData: userDataSlice.reducer,
  },
});
```
Define the profilePictureSlice using Redux Toolkit's createSlice
```javascript
export const profilePictureSlice = createSlice({
  name: 'counter',
  initialState: {
    profilePicture: null,
  },
  reducers: {
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
  },
});
```
We use the useDispatch hook to dispatch the setProfilePicture action, updating the Redux state with the photoUrl from the response. Then, we utilize the useSelector hook to retrieve the profilePicture from the Redux store, allowing us to access the updated profile picture state.
```javascript
  const dispatch = useDispatch();
  dispatch(setProfilePicture(response.photoUrl));

  const { profilePicture } = useSelector((state) => state.profilePicture);
```


**Lesson Learned:** Using Redux tool kit simplifies state management by centralizing application state in a single store, making it easier to access and update shared data across components

## Successes & Areas for Improvement

**Successes:**

- Successfully implemented Redux to store and manage global state, reducing the need for prop drilling.

**Areas for Improvement:**

- Reduce unnecessary re-renders by properly structuring slices and using selectors efficiently.
