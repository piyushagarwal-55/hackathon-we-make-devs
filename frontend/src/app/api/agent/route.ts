import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to communicate with the E-commerce Agent backend
 * Proxies requests to the Python ADK agent running on localhost:8000
 */

const AGENT_BACKEND_URL = process.env.AGENT_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, session_id } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Call the ADK agent backend
    const response = await fetch(`${AGENT_BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: session_id || `session_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent backend returned ${response.status}`);
    }

    const data = await response.json();

    // Expected format from tambo_integrated_agent.py:
    // {
    //   "agent_response": "...",
    //   "ui_component": "ProductGrid",
    //   "ui_props": { products: [...], ... },
    //   "ui_reason": "..."
    // }

    return NextResponse.json({
      success: true,
      response: data.agent_response,
      ui: {
        component: data.ui_component,
        props: data.ui_props,
        reason: data.ui_reason,
      },
    });
  } catch (error) {
    console.error('Error calling agent backend:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Agent API is running',
    backend_url: AGENT_BACKEND_URL,
  });
}
