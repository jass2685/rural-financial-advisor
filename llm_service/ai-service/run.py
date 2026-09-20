import os
import sys
import uvicorn

# Get the absolute path of the ai-service directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Insert it at the very beginning of sys.path so 'app' can always be found
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)