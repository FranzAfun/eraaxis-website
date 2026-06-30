import { api } from "./api";

/**
 * Expected shape from GET /bootstrap:
 * {
 *   settings:           { orgName, tagline, address, email, phone, description }
 *   socials:            { linkedin, x, instagram, tiktok, whatsapp }
 *   metrics:            { learnersCount, partnerSchools, studentProjects, yearLevels }
 *   cta:                { primary: { label, href }, secondary: { label, href } }
 *   featuredProgrammes: Programme[]
 *   featuredInsights:   Insight[]
 *   partners:           Partner[]
 * }
 */
export async function fetchBootstrap() {
  return api.get("/bootstrap");
}
