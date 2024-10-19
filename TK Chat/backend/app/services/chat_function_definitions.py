# This module contains the definitions of functions that the AI assistant can call.
# Each function definition is a dictionary that follows OpenAI's function calling schema.


# Function Definitions

provide_info_and_navigate = {
    "name": "provide_info_and_navigate",
    "description": "Provides information and suggests navigating to a specific section of the website.",
    "parameters": {
        "type": "object",
        "properties": {
            "section_name": {
                "type": "string",
                "description": "The name of the section to navigate to (e.g., 'about', 'projects', 'experience', 'certificates', 'education')."
            },
            "info": {
                "type": "string",
                "description": "The information to provide to the user."
            }
        },
        "required": ["section_name", "info"]
    }
}

# Add more function definitions here as needed.

# Assemble all function definitions into a list
function_definitions = [
    provide_info_and_navigate,
    # Add other functions here
]
