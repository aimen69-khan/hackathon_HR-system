import PageHeader from '../../components/layout/PageHeader.jsx';
import AIChat from '../../components/ai/AIChat.jsx';
export default function AIAssistantPage() {
  return (<><PageHeader title="AI assistant" subtitle="Answers are limited to the data your role can see" /><div style={{ maxWidth: 760 }}><AIChat embedded /></div></>);
}
