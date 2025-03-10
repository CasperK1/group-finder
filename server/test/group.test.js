const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Group = require("../models/Group");
const User = require("../models/User");

const groups = [
  {
    information: {
      name: "Test Group 1",
      city: "Helsinki",
      groupSize: 5,
    },
    owner: "Owner 1"
  },
  {
    information: {
      name: "Test Group 2",
      city: "Espoo",
      groupSize: 8,
    },
    owner: "Owner 2"
  }
];

let groupIds = [];
let authToken;
let userId;
let userId2;
const wrongToken = "123456";

jest.setTimeout(30000);

beforeAll(async () => {
  // Register new test user
  await User.deleteMany({});
  await api
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

  // Find the user and manually verify them
  const user = await User.findOne({email: "testuser@example.com"});
  user.isVerified = true;
  await user.save();

  // Login and get the token and user ID
  const login = await api
    .post("/api/auth/login")
    .send({email: "testuser@example.com", password: "TestPassword123"});

  authToken = login.body.token;
  userId = login.body.userId;

  // Register another test user
  await api
    .post("/api/auth/register")
    .send({
      email: "testuser2@example.com",
      username: "testuser2",
      password: "TestPassword123",
      firstName: "Test 2",
      lastName: "User 2",
      major: "CS",
      academicInterests: ["AI"],
    });

  // Find the user and manually verify them
  const user2 = await User.findOne({email: "testuser2@example.com"});
  user2.isVerified = true;
  await user2.save();
  userId2 = user2._id;

  // Add groups for testing
  await Group.deleteMany({});
  const insertedGroups = await Group.insertMany(groups);
  groupIds = insertedGroups.map(group => group._id.toString());

  try {
    if (require('../services/s3Service').redis) {
      await require('../services/s3Service').redis.quit();
    }
    console.log("User collection cleared");
  } catch (error) {
    console.error("Error closing connections:", error);
  }
});

describe("Group Controller", () => {
  describe("Get /api/groups", () => {
    it("should return all groups as JSON when GET /api/groups is called", async () => {
      const response = await api
      .get("/api/groups")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
      expect(response.body).toHaveLength(groups.length);
    });
  });

  describe("GET /api/groups/:id", () => {
    it("should return one group with the specified ID", async () => {
      const response = await api
        .get(`/api/groups/${groupIds[0]}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body._id).toBe(groupIds[0]);
    });

    it("should return 404 for a non-existing group ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.get(`/api/groups/${nonExistentId}`).expect(404);
    });
  });

  describe("POST /api/groups", () => {
    it("should create a new group", async () => {
      const newGroup = {
        name: "New Group 1",
        city: "Helsinki",
        groupSize: 5,
        owner: userId
      };

      const response = await api
        .post("/api/groups")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newGroup)
        .expect(201);

      groupIds.push(response.body._id);
    
      const groupsAfterPost = await Group.find({});
      expect(groupsAfterPost).toHaveLength(groups.length + 1);
      const groupNames = groupsAfterPost.map((group) => group.information.name);
      expect(groupNames).toContain(newGroup.name);
    });

    it("should return 400 for missing required fields", async () => {
      const newGroup = {
        name: "New Group 1",
        owner: userId
      };

      await api
        .post("/api/groups")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newGroup)
        .expect(400);
    });

    it("should return 401 when not logged in", async () => {
      const newGroup = {
        name: "New Group 1",
        city: "Helsinki",
        groupSize: 5,
        owner: userId
      };

      await api
        .post("/api/groups")
        .set("Authorization", `Bearer ${wrongToken}`)
        .send(newGroup)
        .expect(401);
    });
  });

  describe("PUT /api/groups/:groupId", () => {
    it("should update one group with new information", async () => {
      const updatedGroup = {
        information: {
          name: "Edited Group 1",
          city: "Vantaa"
        }
      };

      await api
        .put(`/api/groups/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedGroup)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const groupAfterPut = await Group.findById(groupIds[2]);
      expect(groupAfterPut.information.name).toBe(updatedGroup.information.name);
      expect(groupAfterPut.information.city).toBe(updatedGroup.information.city);
    });

    it("should return 400 for trying to update group while not being it's owner", async () => {
      const updatedGroup = {
        information: {
          name: "Edited Group 1",
          city: "Vantaa"
        }
      };

      await api
        .put(`/api/groups/${groupIds[0]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedGroup)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("PUT /api/groups/join/:groupId", () => {
    it("should add current user to a group's members list", async () => {
      await api
        .put(`/api/groups/join/${groupIds[0]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const groupAfterPut = await Group.findById(groupIds[0]);
      expect(groupAfterPut.members.map(id => id.toString())).toContain(userId);
    });
  });

  describe("PUT /api/groups/leave/:groupId", () => {
    it("should remove current user from a group's members list", async () => {
      await api
        .put(`/api/groups/leave/${groupIds[0]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const groupAfterPut = await Group.findById(groupIds[0]);
      expect(groupAfterPut.members.map(id => id.toString())).not.toContain(userId);
    });
  });

  describe("PUT /api/groups/addMod/:groupId", () => {
    it("should add another user to the group's moderators list", async () => { 
      const newModerator = {
        userId: userId2.toString()
      };

      // Add the other user to the group's members list
      const group = await Group.findById(groupIds[2]);
      group.members.push(userId2.toString());
      group.save();

      await api
        .put(`/api/groups/addMod/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(newModerator)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const groupAfterPut = await Group.findById(groupIds[2]);
      expect(groupAfterPut.moderators.map(id => id.toString())).toContain(userId2.toString());
    });
  });

  describe("PUT /api/groups/removeMod/:groupId", () => {
    it("should remove the other user from the group's moderators list", async () => {
      const moderator = {
        userId: userId2.toString()
      };

      await api
        .put(`/api/groups/removeMod/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(moderator)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const groupAfterPut = await Group.findById(groupIds[2]);
      expect(groupAfterPut.moderators.map(id => id.toString())).not.toContain(userId2.toString());
    });
  });

  describe("PUT /api/groups/kick/:groupId", () => {
    it("should kick the other user from the group", async () => {
      const user = {
        userId: userId2.toString()
      };

      await api
        .put(`/api/groups/kick/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(user)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const groupAfterPut = await Group.findById(groupIds[2]);
      expect(groupAfterPut.members.map(id => id.toString())).not.toContain(userId2.toString());
    });
  });

  describe("POST /api/groups/createEvent/:groupId", () => {
    it("should create an event in the group", async () => {
      const newEvent = {
        title: "Event Name",
        dateTime: "2025-03-15T14:30:00.000Z"
      };

      await api
        .post(`/api/groups/createEvent/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("DELETE /api/groups/removeEvent/:groupId", () => {
    it("should delete the created event from the group", async () => {
      const group = await Group.findById(groupIds[2]);

      const removedEvent = {
        eventId: group.events[0]._id.toString()
      };

      await api
        .delete(`/api/groups/deleteEvent/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(removedEvent)
        .expect(204)
    });
  });

  describe("DELETE /api/groups/:groupId", () => {
    it("should delete the group", async () => {
      await api
        .delete(`/api/groups/${groupIds[2]}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204)
    });
  });
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
});