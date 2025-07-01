import React from 'react';
import Layout from '../components/Layout';
import Templates from '../components/Templates';
import { useTemplates } from '../contexts/TemplatesContext';

const TemplatesPage: React.FC = () => {
  const { selectedTemplate, handleTemplateSelect } = useTemplates();

  return (
    <Layout>
      <Templates
        onTemplateSelect={handleTemplateSelect}
        selectedTemplateId={selectedTemplate?.id}
      />
    </Layout>
  );
};

export default TemplatesPage;
