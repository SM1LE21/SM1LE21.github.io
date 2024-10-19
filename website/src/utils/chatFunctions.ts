// src/utils/chatFunctions.ts

import { Message } from './api';
import { navigateToSection } from './navigationHelpers';
import { NavigateFunction, Location } from 'react-router-dom';

export interface FunctionCall {
  name: string;
  arguments: any;
}

interface FunctionCallHelpers {
  navigate: NavigateFunction;
  location: Location;
  // Add other helpers if needed
}

type FunctionCallHandler = (
  args: any,
  helpers: FunctionCallHelpers
) => Promise<Message[]>;

export const provideInfoAndNavigate: FunctionCallHandler = async (args, helpers) => {
  const messages: Message[] = [];

// Navigate to the section
if (args.section_name) {
    const navigateMessage: Message = {
        role: 'assistant',
        content: `Navigating to ${args.section_name} section...`,
    };
    messages.push(navigateMessage);

  // Display the info as an assistant message
  if (args.info) {
    const infoMessage: Message = {
      role: 'assistant',
      content: args.info,
    };
    messages.push(infoMessage);
  }


    // Call the navigation function
    if (helpers && helpers.navigate && helpers.location) {
      navigateToSection(args.section_name, helpers.navigate, helpers.location);
    } else {
      console.warn('Navigation helpers not provided');
    }
  }

  return messages;
};

// Map of function call handlers
export const functionCallHandlers: {
  [key: string]: FunctionCallHandler;
} = {
  provide_info_and_navigate: provideInfoAndNavigate,
  // Add more handlers here
};
