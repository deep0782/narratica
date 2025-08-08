import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 export function parseStoryToJSON(storyString: string) {
    const result = {
        title: '',
        theme: '',
        characters: [],
        storyPages: []
    };
    
    // Split the string into lines and filter out empty lines
    const lines = storyString.split('\n').filter(line => line.trim() !== '');
    
    let currentSection = '';
    let currentCharacter = null;
    let currentPage = null;
    let isMultiLineText = false;
    let multiLineContent = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Parse story title
        if (line.startsWith('## **Story Title**:')) {
            result.title = line.replace('## **Story Title**:', '').trim();
        }
        
        // Parse story theme
        else if (line.startsWith('## **Story Theme**:')) {
            result.theme = line.replace('## **Story Theme**:', '').trim();
        }
        
        // Parse story characters section
        else if (line.startsWith('## **Story Characters**:')) {
            currentSection = 'characters';
        }
        
        // Parse story text and image prompts section
        else if (line.startsWith('## **Story Text and Image Prompts**:')) {
            currentSection = 'storyPages';
        }
        
        // Parse individual character sections
        else if (currentSection === 'characters' && line.match(/^### Character \d+$/)) {
            // Start a new character
            currentCharacter = {
                name: '',
                description: '',
                imagePrompt: ''
            };
            (result.characters as Array<typeof currentCharacter>).push(currentCharacter);
        }
        
        // Parse character properties
        else if (currentSection === 'characters' && currentCharacter) {
            if (line.startsWith('**name**:')) {
                currentCharacter.name = line.replace('**name**:', '').trim();
            }
            else if (line.startsWith('**description**:')) {
                currentCharacter.description = line.replace('**description**:', '').trim();
            }
            else if (line.startsWith('**image_prompt**:')) {
                currentCharacter.imagePrompt = line.replace('**image_prompt**:', '').trim();
            }
        }
        
        // Parse story pages
        else if (currentSection === 'storyPages' && line.startsWith('### Page')) {
            const pageMatch = line.match(/### Page (\d+)/);
            const pageNumber = pageMatch ? parseInt(pageMatch[1]) : result.storyPages.length + 1;
            
            currentPage = {
                page: pageNumber,
                text: '',
                imagePrompt: ''
            };
            (result.storyPages as Array<typeof currentPage>).push(currentPage);
            isMultiLineText = false;
            multiLineContent = '';
        }
        
        // Parse page text
        else if (currentSection === 'storyPages' && line.startsWith('**Text**:')) {
            if (currentPage) {
                const textContent = line.replace('**Text**:', '').trim();
                if (textContent) {
                    currentPage.text = textContent;
                } else {
                    // Text might continue on next lines
                    isMultiLineText = true;
                    multiLineContent = '';
                }
            }
        }
        
        // Parse page image prompt
        else if (currentSection === 'storyPages' && line.startsWith('**Image Prompt**:')) {
            if (currentPage) {
                currentPage.imagePrompt = line.replace('**Image Prompt**:', '').trim();
                isMultiLineText = false;
            }
        }
        
        // Handle multi-line text content
        else if (currentSection === 'storyPages' && isMultiLineText && currentPage && 
                 !line.startsWith('**Image Prompt**:') && !line.startsWith('### Page')) {
            if (multiLineContent) {
                multiLineContent += ' ' + line;
            } else {
                multiLineContent = line;
            }
            currentPage.text = multiLineContent;
        }
    }
    
    return result;
}