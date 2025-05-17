# Strategy

- build a fine-tuned model which takes `post_text` and gives back depression `symptoms`.
  - build jsonl ✅
  - split jsonl ✅
  - eval model ✅ (I am not happy with results but this was worth an experiement) ⚠️
- LLM which asks user for how they are feeling and give back symptoms ✅
- use fine tuned model as tool ✅
- build agent to extract user info and then use tool and give final answer ✅
- deploy simple frontend with next.js on vercel 