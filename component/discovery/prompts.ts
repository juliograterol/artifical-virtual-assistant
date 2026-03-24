export const prompts = [
  {
    title: "Craft a Job Description",
    description:
      "Generate a clear and compelling job description tailored to a role and company.",
    prompt:
      "Hello AVA! Please create a professional and engaging job description.\n\n Role: {{role}}\n\n Company: {{company}}\n\n Industry: {{industry}}\n\n Responsibilities: {{responsibilities}}\n\n Requirements: {{requirements}}\n\n Location: {{location}}\n\n Employment Type: {{employment_type}}\n\n Tone: {{tone}}\n\n Structure the response with:\n\n - Job Title\n\n - About the Company\n\n - Key Responsibilities\n\n - Requirements\n\n - Nice-to-Have Skills (optional)\n\n - Benefits (optional)\n\n - Call to Action\n\n Keep it concise, appealing, and aligned with modern hiring standards.\n\n",
  },
];
