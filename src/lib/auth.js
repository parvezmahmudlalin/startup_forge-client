import dns from "node:dns";
dns.setServers(["8.8.8.8","8.8.4.4","1.1.0.0"])

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("startup_forge");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
  
    client
  }),
  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "Collaborator",
      }
    }
}});