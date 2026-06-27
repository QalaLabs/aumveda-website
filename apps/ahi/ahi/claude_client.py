import os
import httpx
from typing import Optional

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-20250514")
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"


class ClaudeClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or CLAUDE_API_KEY
        self.model = CLAUDE_MODEL
        self.client = httpx.AsyncClient(
            timeout=60.0,
            headers={
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
        )

    async def generate(self, system_prompt: str, user_prompt: str, max_tokens: int = 2048) -> str:
        body = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
        }
        resp = await self.client.post(ANTHROPIC_API_URL, json=body)
        resp.raise_for_status()
        data = resp.json()
        return data["content"][0]["text"]

    async def close(self):
        await self.client.aclose()
