import React from 'react';
import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from '../../content/legalContent';
import LegalDocumentModal from './LegalDocumentModal';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsModal({ visible, onClose }: TermsModalProps) {
  return (
    <LegalDocumentModal
      visible={visible}
      onClose={onClose}
      title="Terms & Conditions"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={TERMS_SECTIONS}
      testID="terms-modal"
    />
  );
}
