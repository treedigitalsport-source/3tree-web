import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In production, this would be a real database (PostgreSQL/Supabase)
// For local MCP integration, we write to the shared MCP mock DB
const DB_PATH = "C:\\Users\\fitne\\Documents\\3Tree_Codebase\\3Tree_MCP\\leads_db.json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: "Lead sent successfully. AI Agent will review it shortly."
    });

  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ success: false, error: "Failed to process lead" }, { status: 500 });
  }
}
