export const prompts = {
  // General

  general: [
    {
      title: "Summarize a Document",
      description: "Turn long content into a clear summary.",
      prompt:
        "Hello AVA! Please summarize the following content clearly and concisely.\n\n Content: {{content}}\n\n Summary Length: {{length}}\n\n Provide:\n\n - A concise summary\n\n - Key takeaways (bullet points)\n\n Keep it easy to scan and accurate.\n\n",
    },

    {
      title: "Draft a Professional Email",
      description: "Generate a polished email for business communication.",
      prompt:
        "Hello AVA! Please draft a professional email.\n\n Purpose: {{purpose}}\n\n Recipient: {{recipient}}\n\n Key Points: {{key_points}}\n\n Tone: {{tone}}\n\n Include:\n\n - Subject line\n\n - Clear structure\n\n - Professional tone\n\n - Call to action (if applicable)\n\n",
    },

    {
      title: "Build a Meeting Agenda",
      description: "Create a structured agenda for effective meetings.",
      prompt:
        "Hello AVA! Please create a structured meeting agenda.\n\n Meeting Topic: {{topic}}\n\n Duration: {{duration}}\n\n Participants: {{participants}}\n\n Objectives: {{objectives}}\n\n Include:\n\n - Clear agenda items\n\n - Time allocation per item\n\n - Goals/outcomes\n\n Keep it efficient and focused.\n\n",
    },

    {
      title: "Extract Key Points",
      description: "Pull the most important insights from content.",
      prompt:
        "Hello AVA! Please extract the key points from the following content.\n\n Content: {{content}}\n\n Provide:\n\n - Bullet-point list of main ideas\n\n - Supporting insights (if relevant)\n\n Keep it concise and structured.\n\n",
    },

    {
      title: "Create a How-To Guide",
      description: "Turn a topic into step-by-step instructions.",
      prompt:
        "Hello AVA! Please create a clear, step-by-step guide.\n\n Topic: {{topic}}\n\n Audience: {{audience}}\n\n Complexity Level: {{level}}\n\n Include:\n\n - Introduction\n\n - Step-by-step instructions\n\n - Tips or best practices\n\n Make it easy to follow and practical.\n\n",
    },

    {
      title: "Prepare for an Interview",
      description: "Help candidates or interviewers get ready.",
      prompt:
        "Hello AVA! Please help prepare for an interview.\n\n Role: {{role}}\n\n Company: {{company}}\n\n Interview Type: {{type}}\n\n Focus Areas: {{focus}}\n\n Provide:\n\n - Likely interview questions\n\n - Suggested answers or guidance\n\n - Preparation tips\n\n Tailor it to the role and keep it actionable.\n\n",
    },
  ],

  // HR

  hr: [
    {
      title: "Craft a Job Description",
      description:
        "Generate a clear and compelling job description tailored to a role and company.",
      prompt:
        "Hello AVA! Please create a professional and engaging job description.\n\n Role: {{role}}\n\n Company: {{company}}\n\n Industry: {{industry}}\n\n Responsibilities: {{responsibilities}}\n\n Requirements: {{requirements}}\n\n Location: {{location}}\n\n Employment Type: {{employment_type}}\n\n Tone: {{tone}}\n\n Structure the response with:\n\n - Job Title\n\n - About the Company\n\n - Key Responsibilities\n\n - Requirements\n\n - Nice-to-Have Skills (optional)\n\n - Benefits (optional)\n\n - Call to Action\n\n Keep it concise, appealing, and aligned with modern hiring standards.\n\n",
    },

    {
      title: "Promote a Role on LinkedIn",
      description: "Create a LinkedIn-ready post to attract candidates.",
      prompt:
        "Hello AVA! Please write a high-converting LinkedIn post to promote an open role.\n\n Role: {{role}}\n\n Company: {{company}}\n\n Key Highlights: {{highlights}}\n\n Location: {{location}}\n\n Apply Link: {{link}}\n\n Tone: {{tone}}\n\n Make it engaging, concise, and human.\n\n Include:\n\n - A strong hook in the first line\n\n - 2–4 short paragraphs\n\n - Relevant emojis (used sparingly)\n\n - 3–5 hashtags\n\n - Clear call to action\n\n",
    },

    {
      title: "Schedule a First-Round Interview",
      description: "Draft a message to coordinate interview availability.",
      prompt:
        "Hello AVA! Please draft a professional email to schedule a first-round interview.\n\n Candidate Name: {{candidate_name}}\n\n Role: {{role}}\n\n Interviewer: {{interviewer}}\n\n Time Options: {{time_options}}\n\n Format: {{format}}\n\n Tone: {{tone}}\n\n Include:\n\n - Greeting\n\n - Invitation to interview\n\n - Available time slots\n\n - Instructions or meeting details\n\n - Request for confirmation\n\n Keep it clear, friendly, and professional.\n\n",
    },

    {
      title: "Decline a Candidate Respectfully",
      description:
        "Send a polite rejection while maintaining a positive relationship.",
      prompt:
        "Hello AVA! Please write a respectful and empathetic rejection email.\n\n Candidate Name: {{candidate_name}}\n\n Role: {{role}}\n\n Stage Reached: {{stage}}\n\n Tone: {{tone}}\n\n Include:\n\n - Appreciation for their time\n\n - Clear but kind rejection\n\n - Optional encouragement\n\n - Keep door open for future opportunities\n\n Avoid overly generic language. Keep it human and respectful.\n\n",
    },

    {
      title: "Plan a First-Week Schedule",
      description: "Create an onboarding plan for a new hire.",
      prompt:
        "Hello AVA! Please create a structured first-week onboarding plan.\n\n Role: {{role}}\n\n Department: {{department}}\n\n Start Date: {{start_date}}\n\n Tools/Systems: {{tools}}\n\n Meetings: {{meetings}}\n\n Tone: {{tone}}\n\n Provide a day-by-day breakdown (Day 1–Day 5) including:\n\n - Onboarding tasks\n\n - Meetings\n\n - Learning goals\n\n Make it practical, organized, and not overwhelming.\n\n",
    },
  ],

  // Sales Agent

  "sales agent": [],

  // Marketing Specialist

  "marketing specialist": [],

  // IT Support

  "it support": [],

  // Scheduler

  scheduler: [],

  // Dispatcher

  dispatcher: [],
};

// ✅ shared type
export type PromptTab = keyof typeof prompts;
