import React from 'react';
import Layout from '../components/Layout';
import Guests from '../components/Guests';
import { useGuests } from '../contexts/GuestsContext';

const GuestsPage: React.FC = () => {
  const { guests, setGuests, selectedGuests, setSelectedGuests } = useGuests();

  return (
    <Layout>
      <Guests
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
        guests={guests}
        setGuests={setGuests}
      />
    </Layout>
  );
};

export default GuestsPage;
