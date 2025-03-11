const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");
const User = require("../models/user");

let authToken;
let userId;

beforeAll(async () => {
  try {
    // Ensure a clean database state
    await mongoose.connection.dropDatabase();
    
    await User.deleteMany();
    console.log("User collection cleared");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
});

describe("Auth and User Routes", () => {
  test("Register a new user", async () => {
    const response = await api
      .post("/api/auth/register")
      .send({
        email: "testuser@example.com",
        username: "testuser",
        password: "TestPassword123",
        firstName: "Test",
        lastName: "User",
        major: "CS",
        academicInterests: ["AI"],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("testuser@example.com");
    verificationToken = response.body.data.verificationToken;
  });

  test("Mock email verification", async () => {
    // Find the user and manually verify them
    const user = await User.findOne({email: "testuser@example.com"});
    user.isVerified = true;
    await user.save();

    // Optionally verify the change
    expect(user.isVerified).toBe(true);
  });

  test("Login with valid credentials", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({email: "testuser@example.com", password: "TestPassword123"});

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    authToken = response.body.token;
    userId = response.body.userId;
  });

  test("Login with invalid password", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({email: "testuser@example.com", password: "WrongPassword123"});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid password");
    expect(response.body.token).toBeUndefined();
  });

  test("Login with non-existent email", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({email: "nonexistent@example.com", password: "TestPassword123"});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User does not exist");
    expect(response.body.token).toBeUndefined();
  });


  test("Accessing protected route without token should return 401", async () => {
    const response = await api
      .get(`/api/users/profile`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toContain("Unauthorized");
  });

  test("Get user profile (private view)", async () => {
    const response = await api
      .get(`/api/users/profile/`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("testuser");
  });


  test("Update user settings", async () => {
    const response = await api
      .put("/api/users/settings")
      .set("Authorization", `Bearer ${authToken}`)
      .send({profile: {major: "Mathematics"}});

    expect(response.statusCode).toBe(200);
    expect(response.body.profile.major).toBe("Mathematics");
  });

  test("Get joined groups", async () => {
    const response = await api
      .get("/api/users/groups/joined")
      .set("Authorization", `Bearer ${authToken}`)
    expect(response.statusCode).toBe(200);
  });

  test("Delete user account", async () => {
    const response = await api
      .delete("/api/users/settings/delete")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain("deleted successfully");
  });
});