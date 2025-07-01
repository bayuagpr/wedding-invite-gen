import React from 'react';
import Layout from '../components/Layout';
import Export from '../components/Export';
import { useTemplates } from '../contexts/TemplatesContext';
import { useGuests } from '../contexts/GuestsContext';

const ExportPage: React.FC = () => {
  const { selectedTemplate } = useTemplates();
  const { guests, setGuests, selectedGuests, setSelectedGuests } = useGuests();

  return (
    <Layout>
      <Export
        selectedTemplate={selectedTemplate}
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
        guests={guests}
        setGuests={setGuests}
      />
    </Layout>
  );
};

export default ExportPage;
