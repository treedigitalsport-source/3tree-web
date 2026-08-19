import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In production, this would be a real database (PostgreSQL/Supabase)
// For local MCP integration, we write to the shared MCP mock DB
const DB_PATH = "C:\\Users\\fitne\\Documents\\3Tree_Codebase\\3Tree_MCP\\leads_db.json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.fullHistory) {
      const reportsDir = "C:\\Users\\fitne\\.gemini\\antigravity\\scratch\\social-media-skills\\reports";
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const reportContent = `# Chat Report - ${timestamp}\n\n` + body.fullHistory.map((msg: any) => `**${msg.role}**: ${msg.text}`).join('\n\n');
      fs.writeFileSync(path.join(reportsDir, `chat-report-${timestamp}.md`), reportContent);
    }

    // Read current leads
    let leads = [];
    if (fs.existsSync(DB_PATH)) {
      leads = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      name: body.name || "Anonymous",
      email: body.email || "no-email@test.com",
      message: body.message || "",
      status: "pending",
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1"
    };

    leads.push(newLead);
    
    // Write back to the mock DB for the MCP to read
    if (fs.existsSync(path.dirname(DB_PATH))) {
      fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));
    }

    return NextResponse.json({ 
      success: true, 
      message: "Lead/Report processed successfully."
    });

  } catch (error) {
    console.error("Error saving lead/report:", error);
    return NextResponse.json({ success: false, error: "Failed to process lead/report" }, { status: 500 });
  }
}
