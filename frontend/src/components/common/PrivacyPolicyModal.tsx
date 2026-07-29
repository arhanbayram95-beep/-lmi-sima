import React from 'react';
import { LEGAL_URLS } from '../../api/config';
import { LEGAL_LAST_UPDATED, PRIVACY_POLICY_SECTIONS } from '../../content/legalContent';
import LegalDocumentModal from './LegalDocumentModal';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  return (
    <LegalDocumentModal
      visible={visible}
      onClose={onClose}
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={PRIVACY_POLICY_SECTIONS}
      url={LEGAL_URLS.privacy}
      testID="privacy-policy-modal"
    />
  );
}
