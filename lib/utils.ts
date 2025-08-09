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
        scenes: []
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
            currentSection = 'scenes';
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
        else if (currentSection === 'scenes' && line.startsWith('### Page')) {
            const pageMatch = line.match(/### Page (\d+)/);
            const pageNumber = pageMatch ? parseInt(pageMatch[1]) : result.scenes.length + 1;
            
            currentPage = {
                page: pageNumber,
                text: '',
                imagePrompt: ''
            };
            (result.scenes as Array<typeof currentPage>).push(currentPage);
            isMultiLineText = false;
            multiLineContent = '';
        }
        
        // Parse page text
        else if (currentSection === 'scenes' && line.startsWith('**Text**:')) {
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
        else if (currentSection === 'scenes' && line.startsWith('**Image Prompt**:')) {
            if (currentPage) {
                currentPage.imagePrompt = line.replace('**Image Prompt**:', '').trim();
                isMultiLineText = false;
            }
        }
        
        // Handle multi-line text content
        else if (currentSection === 'scenes' && isMultiLineText && currentPage && 
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

// Type definitions
interface Character {
    name: string;
    description: string;
    image_prompt: string;
}

interface Page {
    page_number: number;
    title: string;
    description: string;
    image_prompt: string;
    characters: string[];
    narration: string;
    setting: string;
    mood: string;
    key_events: string;
}

interface Story {
    title: string;
    theme: string;
    characters: Character[];
    pages: Page[];
}

export function markdownToJson(markdownText: string): Story {
    const result: Story = {
        title: '',
        theme: '',
        characters: [],
        pages: []
    };
    
    const lines = markdownText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentSection: string | null = null;
    let currentCharacter: Character | null = null;
    let currentPage: Page | null = null;
    let currentField: string | null = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for main headers
        if (line.startsWith('## **Story Title**:')) {
            result.title = line.replace('## **Story Title**:', '').trim();
        }
        else if (line.startsWith('## **Story Theme**:')) {
            result.theme = line.replace('## **Story Theme**:', '').trim();
        }
        else if (line.startsWith('## **Story Characters**:')) {
            currentSection = 'characters';
        }
        else if (line.startsWith('## **Story Text and Image Prompts**:')) {
            currentSection = 'pages';
        }
        // Character sections
        else if (line.startsWith('### Character')) {
            if (currentCharacter) {
                result.characters.push(currentCharacter);
            }
            currentCharacter = {
                name: '',
                description: '',
                image_prompt: ''
            };
        }
        else if (line.startsWith('**name**:')) {
            if (currentCharacter) {
                currentCharacter.name = line.replace('**name**:', '').trim();
            }
        }
        else if (line.startsWith('**description**:')) {
            if (currentCharacter) {
                currentCharacter.description = line.replace('**description**:', '').trim();
            }
        }
        else if (line.startsWith('**image_prompt**:')) {
            if (currentCharacter) {
                currentCharacter.image_prompt = line.replace('**image_prompt**:', '').trim();
            }
        }
        // Page sections
        else if (line.startsWith('### Page')) {
            if (currentPage) {
                result.pages.push(currentPage);
            }
            currentPage = {
                page_number: parseInt(line.match(/\d+/)![0]),
                title: '',
                description: '',
                image_prompt: '',
                characters: [],
                narration: '',
                setting: '',
                mood: '',
                key_events: ''
            };
            currentField = null;
        }
        else if (line.startsWith('**Title**:')) {
            if (currentPage) {
                currentPage.title = line.replace('**Title**:', '').trim();
            }
        }
        else if (line.startsWith('**Description**:')) {
            if (currentPage) {
                currentPage.description = line.replace('**Description**:', '').trim();
                currentField = 'description';
            }
        }
        else if (line.startsWith('**Image Prompt**:')) {
            if (currentPage) {
                currentPage.image_prompt = line.replace('**Image Prompt**:', '').trim();
                currentField = 'image_prompt';
            }
        }
        else if (line.startsWith('**Characters**:')) {
            if (currentPage) {
                const charactersText = line.replace('**Characters**:', '').trim();
                currentPage.characters = charactersText.split(',').map(c => c.trim()).filter(c => c.length > 0);
            }
        }
        else if (line.startsWith('**Narration**:')) {
            if (currentPage) {
                currentPage.narration = line.replace('**Narration**:', '').trim();
                currentField = 'narration';
            }
        }
        else if (line.startsWith('**Setting**:')) {
            if (currentPage) {
                currentPage.setting = line.replace('**Setting**:', '').trim();
            }
        }
        else if (line.startsWith('**Mood**:')) {
            if (currentPage) {
                currentPage.mood = line.replace('**Mood**:', '').trim();
            }
        }
        else if (line.startsWith('**Key Events**:')) {
            if (currentPage) {
                currentPage.key_events = line.replace('**Key Events**:', '').trim();
            }
        }
        // Handle multi-line content
        else if (!line.startsWith('**') && !line.startsWith('##') && !line.startsWith('###')) {
            if (currentField === 'description' && currentPage) {
                currentPage.description += ' ' + line;
            }
            else if (currentField === 'image_prompt' && currentPage) {
                currentPage.image_prompt += ' ' + line;
            }
            else if (currentField === 'narration' && currentPage) {
                currentPage.narration += ' ' + line;
            }
        }
    }
    
    // Add the last character and page if they exist
    if (currentCharacter) {
        result.characters.push(currentCharacter);
    }
    if (currentPage) {
        result.pages.push(currentPage);
    }
    
    return result;
}
