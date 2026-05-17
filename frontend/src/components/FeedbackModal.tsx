import React, { useState } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import { financeService } from '../api/services';
import type { FeedbackRequestDTO } from '../types';
import { Card, View, Text, Button, Select, Input } from './ui';

interface FeedbackModalProps {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [experience, setExperience] = useState('Excellent');
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [likedFeatures, setLikedFeatures] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const features = ['Speed', 'Interface', 'Ease of Use', 'Security', 'Customer Support'];

  const handleCheckboxChange = (feature: string) => {
    setLikedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recommend === null) {
      alert('Please select if you would recommend us.');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedback: FeedbackRequestDTO = {
        experience,
        recommend,
        likedFeatures,
        comments
      };
      await financeService.submitFeedback(feedback);
      setIsSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      alert('Failed to submit feedback. Thank you for trying!');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const expOptions = [
    { label: 'Excellent 🚀', value: 'Excellent' },
    { label: 'Good 👍', value: 'Good' },
    { label: 'Average 😐', value: 'Average' },
    { label: 'Poor 👎', value: 'Poor' },
  ];

  if (isSubmitted) {
    return (
      <View style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, backdropFilter: 'blur(4px)' }} flex align="center" justify="center">
        <Card className="fade-in" style={{ width: '100%', maxWidth: 420, textAlign: 'center' }} padding="40px 32px">
          <View style={{ color: '#10b981', marginBottom: 20 }}>
            <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
          </View>
          <Text variant="h2" style={{ marginBottom: 12 }}>Thank You!</Text>
          <Text color="#848484">Your feedback helps us make FinanceApp better for everyone.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, backdropFilter: 'blur(4px)' }} padding={16} flex align="center" justify="center">
      <Card className="fade-in" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }} padding={0}>
        <View style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }} flex align="center" justify="space-between">
          <Text variant="h3">Feedback</Text>
          <Button variant="icon" onClick={onClose} style={{ color: '#848484' }}><X size={24} /></Button>
        </View>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <Text color="#848484" style={{ marginBottom: 20 }}>Great! Your transaction was successful. How was your experience?</Text>

          <View className="form-group" style={{ marginBottom: 20 }}>
            <Text variant="label" style={{ marginBottom: 8 }}>Rate your experience</Text>
            <Select value={experience} onChange={(e) => setExperience(e.target.value)} options={expOptions} />
          </View>

          <View className="form-group" style={{ marginBottom: 20 }}>
            <Text variant="label" style={{ marginBottom: 12 }}>Would you recommend us?</Text>
            <View flex gap={24}>
              <Text variant="label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                <Input type="radio" name="recommend" checked={recommend === true} onChange={() => setRecommend(true)} style={{ width: 18, height: 18, cursor: 'pointer', padding: 0 }} />
                <span>Yes, absolutely</span>
              </Text>
              <Text variant="label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                <Input type="radio" name="recommend" checked={recommend === false} onChange={() => setRecommend(false)} style={{ width: 18, height: 18, cursor: 'pointer', padding: 0 }} />
                <span>Maybe not yet</span>
              </Text>
            </View>
          </View>

          <View className="form-group" style={{ marginBottom: 24 }}>
            <Text variant="label" style={{ marginBottom: 12 }}>What did you like most?</Text>
            <View grid gridCols="1fr 1fr" gap={12}>
              {features.map(feature => (
                <Text variant="label" key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                  <Input type="checkbox" checked={likedFeatures.includes(feature)} onChange={() => handleCheckboxChange(feature)} style={{ width: 18, height: 18, cursor: 'pointer', padding: 0 }} />
                  <span>{feature}</span>
                </Text>
              ))}
            </View>
          </View>

          <View className="form-group" style={{ marginBottom: 28 }}>
            <Text variant="label" style={{ marginBottom: 8 }}>Any additional comments?</Text>
            <Input multiline value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Tell us more..." style={{ minHeight: 80, resize: 'vertical' }} />
          </View>

          <View flex gap={12} justify="flex-end">
            <Button variant="ghost" type="button" onClick={onClose} style={{ color: '#848484' }}>Skip</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : <><Send size={18} />Submit Feedback</>}
            </Button>
          </View>
        </form>
      </Card>
    </View>
  );
}