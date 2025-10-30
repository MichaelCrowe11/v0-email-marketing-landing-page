# Azure OpenAI Document Generation Integration

## Overview
Integrate Microsoft's Document Generation Solution Accelerator with Crowe Logic AI chat interface using a three-panel workspace layout.

## Architecture

### Three-Panel Layout
```
┌─────────────────────────────────────────────────────────────┐
│                     Top Navigation Bar                       │
├──────────────┬──────────────────────┬──────────────────────┤
│              │                      │                       │
│  Left Panel  │    Center Panel      │    Right Panel       │
│              │                      │                       │
│  Raw Code/   │    Chat Interface    │   Rendered Document  │
│  Markdown    │    (Crowe Logic AI)  │   Preview            │
│              │                      │                       │
│  - Syntax    │    - Messages        │   - Live Preview     │
│    highlight │    - Input box       │   - PDF/Word view    │
│  - Editable  │    - File uploads    │   - Download button  │
│  - Copy btn  │    - Suggestions     │   - Share options    │
│              │                      │                       │
└──────────────┴──────────────────────┴──────────────────────┘
```

## Use Cases

### 1. SOP Generation
**User:** "Generate an SOP for oyster mushroom substrate preparation"

**Left Panel:** Shows markdown/code structure
```markdown
# Standard Operating Procedure
## Oyster Mushroom Substrate Preparation

### Materials Required
- Hardwood sawdust: 50%
- Wheat bran: 20%
...
```

**Center Panel:** Chat conversation with Crowe Logic AI

**Right Panel:** Beautifully formatted PDF preview with Southwest Mushrooms branding

### 2. Contamination Report
**User:** Uploads contamination photo, asks for analysis report

**Left Panel:** JSON/structured data
```json
{
  "analysis": {
    "contaminant": "Trichoderma",
    "confidence": 92,
    "recommendations": [...]
  }
}
```

**Center Panel:** Chat with image analysis

**Right Panel:** Professional contamination report PDF

### 3. Business Plan Generation
**User:** "Create a business plan for a 1000 sq ft mushroom farm"

**Left Panel:** Outline and sections being generated

**Center Panel:** Interactive Q&A to gather details

**Right Panel:** Live-updating business plan document

## Technical Implementation

### Azure OpenAI Integration
```typescript
// Azure OpenAI Service
const azureConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  deploymentName: 'gpt-4',
  apiVersion: '2024-02-15-preview'
}

// Document Generation
const documentService = {
  generateSOP: async (params) => {
    // Use Azure AI Search for knowledge retrieval
    // Generate structured document
    // Return markdown + metadata
  },
  
  renderDocument: async (markdown, template) => {
    // Convert to PDF/Word using Azure services
    // Apply branding/styling
    // Return preview URL
  }
}
```

### Component Structure
```
components/
├── chat/
│   ├── chat-workspace.tsx          # Main 3-panel layout
│   ├── chat-panel.tsx              # Center: Chat interface
│   ├── code-editor-panel.tsx       # Left: Raw code/markdown
│   ├── document-preview-panel.tsx  # Right: Rendered preview
│   └── panel-controls.tsx          # Toggle panels, resize
```

## Features

### Panel Controls
- **Toggle visibility:** Show/hide left or right panels
- **Resize:** Drag to adjust panel widths
- **Fullscreen:** Expand any panel to full width
- **Sync scroll:** Link code and preview scrolling

### Document Types
1. **SOPs** - Standard Operating Procedures
2. **Reports** - Contamination analysis, yield reports
3. **Business Plans** - Financial models, market analysis
4. **Training Materials** - Guides, checklists
5. **Compliance Docs** - Safety protocols, certifications

### Export Options
- PDF (with Southwest Mushrooms branding)
- Word (.docx)
- Markdown (.md)
- HTML
- Print-ready format

## Azure Services Used

### 1. Azure OpenAI Service
- GPT-4 for content generation
- Embeddings for knowledge retrieval
- Fine-tuned on Michael Crowe's content

### 2. Azure AI Search
- Index all YouTube transcripts
- Index consulting case studies
- Index production SOPs
- Semantic search for relevant context

### 3. Azure Blob Storage
- Store generated documents
- Version control
- Share links with expiration

### 4. Azure Functions
- Document rendering pipeline
- PDF generation
- Template processing

## UI/UX Design

### Color Coding
- **Left Panel (Code):** Dark theme with syntax highlighting
- **Center Panel (Chat):** Your existing beautiful gradient design
- **Right Panel (Preview):** Clean white/light theme for document

### Responsive Behavior
- **Desktop (>1200px):** All 3 panels visible
- **Tablet (768-1200px):** Chat + one panel (toggle between code/preview)
- **Mobile (<768px):** Chat only, with buttons to view code/preview in modal

### Panel States
```typescript
type PanelLayout = 
  | 'all-three'           // Default: Code | Chat | Preview
  | 'chat-code'           // Chat | Code (no preview)
  | 'chat-preview'        // Chat | Preview (no code)
  | 'chat-only'           // Just chat (mobile)
  | 'code-preview'        // Code | Preview (no chat - review mode)
```

## Implementation Phases

### Phase 1: UI Layout (Week 1)
- [ ] Create three-panel workspace component
- [ ] Add panel resize functionality
- [ ] Implement panel toggle controls
- [ ] Mobile responsive design

### Phase 2: Azure Integration (Week 2)
- [ ] Set up Azure OpenAI connection
- [ ] Configure Azure AI Search
- [ ] Implement document generation API
- [ ] Add blob storage for documents

### Phase 3: Document Features (Week 3)
- [ ] Markdown editor with syntax highlighting
- [ ] Live preview rendering
- [ ] PDF export functionality
- [ ] Template system (SOP, reports, etc.)

### Phase 4: Polish & Testing (Week 4)
- [ ] Add Southwest Mushrooms branding to exports
- [ ] Implement version history
- [ ] Add collaboration features (share links)
- [ ] Performance optimization
- [ ] User testing

## Example Workflow

### SOP Generation Flow
1. User: "Generate substrate prep SOP for oyster mushrooms"
2. Crowe Logic AI: "I'll create that for you. What's your batch size?"
3. User: "50 pound bags"
4. **Left Panel:** Shows markdown being generated in real-time
5. **Center Panel:** Continues conversation for details
6. **Right Panel:** Live preview updates as content generates
7. User can edit markdown directly in left panel
8. Changes reflect immediately in right panel preview
9. Click "Export PDF" to download final document

## Benefits

### For Users
- **Visual feedback:** See document being created in real-time
- **Edit control:** Modify raw content directly
- **Professional output:** Branded, print-ready documents
- **Fast iteration:** Chat to refine, see results instantly

### For Business
- **Differentiation:** Unique workspace experience
- **Value add:** Not just chat, but complete document solution
- **Upsell opportunity:** Premium templates, advanced exports
- **Data collection:** Learn what documents users need most

## Cost Considerations

### Azure Services (Estimated Monthly)
- Azure OpenAI API: $100-500 (depending on usage)
- Azure AI Search: $75-250 (basic tier)
- Blob Storage: $5-20 (minimal)
- Functions: $10-50 (consumption plan)

**Total:** ~$200-800/month depending on scale

### ROI
- Premium feature for paid tiers
- Charge per document export
- Or include in higher subscription tiers
