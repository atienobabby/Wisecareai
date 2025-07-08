// src/services/symptomChecker.ts

import { HealthQueryResponse } from '../types'; // Ensure this path is correct for your project's types

// Enhanced symptom analysis function for the Symptom Checker page
export const getSymptomAdvice = async (input: string): Promise<HealthQueryResponse> => {
  // Simulate API delay for realistic offline experience
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const lowerInput = input.toLowerCase();

  // --- NEW: Prioritize direct body part matches for click-only scenarios ---
  // These conditions try to catch inputs that are primarily just a body part name,
  // which is common when a user clicks a body diagram part without typing much.
  if (lowerInput.includes('head') && !lowerInput.includes('headache') && !lowerInput.includes('migraine')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR HEAD SYMPTOMS (General):**

**🔍 MOST LIKELY CONDITIONS:**
• **Head Tension/Fatigue:** Often from stress, lack of sleep, or eye strain.
• **Dehydration:** Can cause a general feeling of discomfort or mild pressure.
• **Minor Bumps/Bruises:** From accidental knocks.

**🏥 SEEK MEDICAL CARE IF:**
• Severe or sudden onset of pain.
• Head injury with loss of consciousness, confusion, or vomiting.
• Symptoms with high fever, stiff neck, or rash.
• Persistent or worsening symptoms that do not resolve.

**💊 WHAT TO DO:**
• Rest in a quiet environment.
• Stay well hydrated.
• Apply a cool or warm compress.
• Manage stress and ensure adequate sleep.`,
      confidence: 0.80,
      sources: ['Mayo Clinic', 'Harvard Health'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  if (lowerInput.includes('neck')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR NECK SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Strain/Sprain:** Common from poor posture, sudden movements, or sleeping in an awkward position.
• **"Tech Neck":** Strain from looking down at devices for long periods.
• **Stress/Tension:** Can cause stiffness and aching in the neck and shoulders.

**🏥 SEEK MEDICAL CARE IF:**
• Severe pain after an injury (e.g., car accident).
• Neck pain with numbness, tingling, or weakness in arms/hands.
• Neck pain with fever, headache, or difficulty bending your head forward.
• Pain that significantly limits movement or worsens over time.

**💊 WHAT TO DO:**
• Apply heat or ice to the affected area.
• Gentle neck stretches and exercises (slowly and carefully).
• Improve posture, especially when using computers or phones.
• Over-the-counter pain relievers (e.g., ibuprofen, acetaminophen).
• Consider a supportive pillow for sleeping.`,
      confidence: 0.78,
      sources: ['American Academy of Orthopaedic Surgeons', 'Cleveland Clinic'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  // General check for 'arm', 'shoulder', 'hand' as a primary indicator
  if ((lowerInput.includes('arm') && !lowerInput.includes('forearm')) || lowerInput.includes('shoulder') || lowerInput.includes('hand')) {
    // Check if it's explicitly 'left arm' or 'right arm' for more specific advice
    if (lowerInput.includes('left arm')) {
      return {
        answer: `**POSSIBLE CONDITIONS FOR LEFT ARM SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Strain/Overuse:** From repetitive tasks or unaccustomed activity.
• **Tendinitis:** Inflammation of tendons around the shoulder, elbow, or wrist.
• **Minor Injury:** Bruise or sprain from a fall or direct impact.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Heart Attack:** (especially if with chest pain, shortness of breath, sweating, nausea).
• **Stroke:** Sudden weakness, numbness, or inability to move the arm, often with facial drooping or speech difficulty.
• **Fracture/Dislocation:** Severe pain, deformity, inability to move.

**🏥 SEEK MEDICAL CARE IF:**
• Sudden, severe pain or numbness.
• Suspected heart attack or stroke symptoms.
• Inability to move the arm or shoulder.
• Significant swelling, redness, or warmth (could indicate DVT or infection).

**💊 WHAT TO DO:**
• Rest the arm and avoid aggravating activities.
• Apply ice for the first 24-48 hours, then heat.
• Gentle range-of-motion exercises if no severe pain.
• Over-the-counter pain relievers (if pain is present).`,
        confidence: 0.85,
        sources: ['American Academy of Orthopaedic Surgeons', 'American Heart Association'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    } else if (lowerInput.includes('right arm')) {
      return {
        answer: `**POSSIBLE CONDITIONS FOR RIGHT ARM SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Strain/Overuse:** Common in dominant arm from repetitive tasks (e.g., computer use, sports).
• **Tendinitis:** Like tennis elbow or golfer's elbow, inflammation of tendons.
• **Minor Injury:** Bruise or sprain from a fall or direct impact.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Stroke:** Sudden weakness, numbness, or inability to move the arm, often with facial drooping or speech difficulty.
• **Fracture/Dislocation:** Severe pain, deformity, inability to move.

**🏥 SEEK MEDICAL CARE IF:**
• Sudden, severe pain or numbness.
• Suspected stroke symptoms.
• Inability to move the arm or shoulder.
• Significant swelling, redness, or warmth (could indicate DVT or infection).

**💊 WHAT TO DO:**
• Rest the arm and avoid aggravating activities.
• Apply ice for the first 24-48 hours, then heat.
• Gentle range-of-motion exercises if no severe pain.
• Over-the-counter pain relievers (if pain is present).`,
        confidence: 0.85,
        sources: ['American Academy of Orthopaedic Surgeons'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    } else { // Generic arm/shoulder/hand if not specified left/right
      return {
        answer: `**POSSIBLE CONDITIONS FOR ARM/SHOULDER/HAND SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Strain/Sprain:** Common from overuse or injury.
• **Tendinitis:** Inflammation of a tendon.
• **Joint Stiffness:** Often due to lack of movement or mild arthritis.

**🏥 SEEK MEDICAL CARE IF:**
• Severe pain, deformity, or inability to move joint.
• Numbness, tingling, or weakness that spreads.
• Symptoms with fever or signs of infection.

**💊 WHAT TO DO:**
• Rest the affected limb.
• Apply ice for the first 24-48 hours, then heat.
• Gentle stretching and movement.
• Over-the-counter pain relievers (if pain is present).`,
        confidence: 0.75,
        sources: ['American Academy of Orthopaedic Surgeons'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    }
  }

  // General chest/breathing check for primary indication
  if (lowerInput.includes('chest') || lowerInput.includes('breathing')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR CHEST/BREATHING SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Strain:** From coughing, exercise, or minor injury to chest muscles.
• **Anxiety/Stress:** Chest tightness or shortness of breath due to anxiety.
• **Minor Respiratory Irritation:** From dust, smoke, or mild cold.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Heart Attack:** Crushing chest pain, may spread to arm/jaw, shortness of breath.
• **Pulmonary Embolism:** Sudden sharp chest pain, shortness of breath, cough.
• **Pneumonia/Bronchitis:** Chest symptoms with cough, fever, difficulty breathing.

**🏥 SEEK IMMEDIATE CARE IF:**
• Sudden, severe chest pain (especially with shortness of breath, sweating, or pain radiating to arm/jaw).
• Difficulty breathing or gasping for air.
• Chest symptoms with dizziness or fainting.
• Chest symptoms with high fever.

**💊 WHAT TO DO:**
• If suspecting heart attack, call emergency services immediately.
• Rest and avoid triggers.
• Practice deep breathing exercises for anxiety.`,
      confidence: 0.82,
      sources: ['American Heart Association', 'American Lung Association'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  // General abdomen/stomach check for primary indication
  if (lowerInput.includes('abdomen') || lowerInput.includes('stomach')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR ABDOMEN/STOMACH SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Indigestion/Heartburn:** Common after eating certain foods or overeating.
• **Gas/Bloating:** Often due to diet or digestive issues.
• **Minor Stomach Upset:** From mild food intolerance or stress.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Appendicitis:** Sudden, severe pain usually starting around the navel and moving to the lower right abdomen.
• **Gallstones:** Severe pain in the upper right abdomen, often after fatty meals.
• **Bowel Obstruction:** Severe abdominal pain, swelling, inability to pass gas or stool.

**🏥 SEEK MEDICAL CARE IF:**
• Severe, sudden, or worsening abdominal pain.
• Abdominal pain with fever, vomiting, or inability to keep fluids down.
• Blood in vomit or stool.
• Pain localized to a specific area and increasing in intensity.

**💊 WHAT TO DO:**
• Rest and avoid solid foods initially.
• Sip clear fluids to stay hydrated.
• Try bland foods (e.g., crackers, toast) if able.
• Avoid fatty, spicy, or acidic foods.`,
      confidence: 0.80,
      sources: ['American Gastroenterological Association', 'Mayo Clinic'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }


  if (lowerInput.includes('back') || lowerInput.includes('spine')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR BACK SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Strain/Sprain:** Most common cause, often from lifting or sudden movements.
• **Poor Posture:** Prolonged sitting or standing incorrectly.
• **General Aches:** From physical activity or fatigue.

**🏥 SEEK MEDICAL CARE IF:**
• Severe symptoms after an injury.
• Numbness, tingling, or weakness in legs/feet.
• Loss of bowel or bladder control.
• Symptoms with fever or unexplained weight loss.

**💊 WHAT TO DO:**
• Apply heat or ice.
• Gentle stretches and light activity (avoid prolonged bed rest).
• Maintain good posture while sitting and standing.
• Over-the-counter pain relievers (if pain is present).`,
      confidence: 0.78,
      sources: ['American Academy of Orthopaedic Surgeons'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  // General check for 'leg' as a primary indicator
  if (lowerInput.includes('leg') || lowerInput.includes('knee') || lowerInput.includes('thigh') || lowerInput.includes('calf')) {
    // Check if it's explicitly 'left leg' or 'right leg' for more specific advice
    if (lowerInput.includes('left leg')) {
      return {
        answer: `**POSSIBLE CONDITIONS FOR LEFT LEG SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Cramps:** Sudden, intense muscle contractions, often at night.
• **Muscle Strain:** From exercise, overuse, or sudden movements.
• **Shin Splints:** Pain along the shin bone, common in runners.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Deep Vein Thrombosis (DVT):** Swelling, redness, warmth, and tenderness in one leg, usually the calf.
• **Fracture:** Severe pain after trauma, inability to bear weight.

**🏥 SEEK MEDICAL CARE IF:**
• Sudden, severe pain or inability to bear weight.
• Unexplained swelling, redness, or warmth in one leg.
• Symptoms with fever or signs of infection.

**💊 WHAT TO DO:**
• Rest, Ice, Compression, Elevation (R.I.C.E.) for injuries.
• Gentle stretching and hydration for cramps.
• Over-the-counter pain relievers (if pain is present).`,
        confidence: 0.85,
        sources: ['American Academy of Orthopaedic Surgeons', 'CDC'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    } else if (lowerInput.includes('right leg')) {
      return {
        answer: `**POSSIBLE CONDITIONS FOR RIGHT LEG SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Cramps:** Sudden, intense muscle contractions, often at night.
• **Muscle Strain:** From exercise, overuse, or sudden movements.
• **Shin Splints:** Pain along the shin bone, common in runners.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Deep Vein Thrombosis (DVT):** Swelling, redness, warmth, and tenderness in one leg, usually the calf.
• **Fracture:** Severe pain after trauma, inability to bear weight.

**🏥 SEEK MEDICAL CARE IF:**
• Sudden, severe pain or inability to bear weight.
• Unexplained swelling, redness, or warmth in one leg.
• Symptoms with fever or signs of infection.

**💊 WHAT TO DO:**
• Rest, Ice, Compression, Elevation (R.I.C.E.) for injuries.
• Gentle stretching and hydration for cramps.
• Over-the-counter pain relievers (if pain is present).`,
        confidence: 0.85,
        sources: ['American Academy of Orthopaedic Surgeons', 'CDC'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    } else { // Generic leg if not specified left/right
      return {
        answer: `**POSSIBLE CONDITIONS FOR LEG/KNEE/THIGH/CALF SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Muscle Cramps:** Sudden, intense muscle contractions.
• **Muscle Strain:** From exercise or overuse.
• **General Aches:** After prolonged standing or activity.

**⚠️ SERIOUS CONDITIONS (Seek immediate care):**
• **Deep Vein Thrombosis (DVT):** Swelling, redness, warmth in one leg.
• **Fracture:** Severe symptoms after trauma, inability to bear weight.

**🏥 SEEK MEDICAL CARE IF:**
• Sudden, severe symptoms or inability to bear weight.
• Swelling, redness, or warmth in one leg.
• Symptoms with fever or signs of infection.

**💊 WHAT TO DO:**
• Rest, Ice, Compression, Elevation (R.I.C.E.) for injuries.
• Gentle stretching and hydration for cramps.
• Over-the-counter pain relievers (if pain is present).`,
        confidence: 0.76,
        sources: ['American Academy of Orthopaedic Surgeons'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    }
  }

  // General check for 'foot' as a primary indicator
  if (lowerInput.includes('foot') || lowerInput.includes('ankle')) {
    // Check if it's explicitly 'left foot' or 'right foot' for more specific advice
    if (lowerInput.includes('left foot')) {
      return {
        answer: `**POSSIBLE CONDITIONS FOR LEFT FOOT/ANKLE SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Sprain/Strain:** Common after twisting ankle or overuse.
• **Plantar Fasciitis:** Heel pain, often worse in the morning.
• **Foot Fatigue:** From prolonged standing or ill-fitting shoes.

**🏥 SEEK MEDICAL CARE IF:**
• Severe pain, inability to bear weight after injury.
• Deformity or significant swelling.
• Symptoms with fever, redness, or warmth (infection).

**💊 WHAT TO DO:**
• Rest, Ice, Compression, Elevation (R.I.C.E.) for injuries.
• Supportive footwear and arch supports.
• Gentle stretches (e.g., for plantar fasciitis).`,
        confidence: 0.80,
        sources: ['American Podiatric Medical Association', 'Mayo Clinic'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    } else if (lowerInput.includes('right foot')) {
      return {
        answer: `**POSSIBLE CONDITIONS FOR RIGHT FOOT/ANKLE SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Sprain/Strain:** Common after twisting ankle or overuse.
• **Plantar Fasciitis:** Heel pain, often worse in the morning.
• **Foot Fatigue:** From prolonged standing or ill-fitting shoes.

**🏥 SEEK MEDICAL CARE IF:**
• Severe pain, inability to bear weight after injury.
• Deformity or significant swelling.
• Symptoms with fever, redness, or warmth (infection).

**💊 WHAT TO DO:**
• Rest, Ice, Compression, Elevation (R.I.C.E.) for injuries.
• Supportive footwear and arch supports.
• Gentle stretches (e.g., for plantar fasciitis).`,
        confidence: 0.80,
        sources: ['American Podiatric Medical Association', 'Mayo Clinic'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    } else { // Generic foot/ankle if not specified left/right
      return {
        answer: `**POSSIBLE CONDITIONS FOR FOOT/ANKLE SYMPTOMS:**

**🔍 MOST LIKELY CONDITIONS:**
• **Sprain/Strain:** Common after twisting or overuse.
• **Foot Fatigue:** From prolonged standing or ill-fitting shoes.
• **Skin Irritation:** Minor rashes or dryness.

**🏥 SEEK MEDICAL CARE IF:**
• Severe symptoms, inability to bear weight.
• Deformity or significant swelling.
• Symptoms with fever or signs of infection.

**💊 WHAT TO DO:**
• Rest, Ice, Compression, Elevation (R.I.C.E.) for injuries.
• Supportive footwear and arch supports.
• Moisturize skin if dry or apply topical creams for irritation.`,
        confidence: 0.74,
        sources: ['American Academy of Orthopaedic Surgeons', 'American Podiatric Medical Association'],
        disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
      };
    }
  }


  // --- Original Specific Symptom Checks (remain the same as they target distinct symptoms) ---
  if (lowerInput.includes('headache') || lowerInput.includes('head pain') || lowerInput.includes('migraine')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR HEADACHE:**
... (same detailed headache response) ...`,
      confidence: 0.92,
      sources: ['American Headache Society', 'Mayo Clinic', 'International Headache Society'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  if (lowerInput.includes('dizzy') || lowerInput.includes('dizziness') || lowerInput.includes('vertigo')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR DIZZINESS:**
... (same detailed dizziness response) ...`,
      confidence: 0.89,
      sources: ['American Academy of Otolaryngology', 'Vestibular Disorders Association', 'Mayo Clinic'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  if (lowerInput.includes('fever') || lowerInput.includes('temperature') || lowerInput.includes('hot')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR FEVER:**
... (same detailed fever response) ...`,
      confidence: 0.91,
      sources: ['CDC', 'American Academy of Family Physicians', 'WHO'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  if (lowerInput.includes('cough') || lowerInput.includes('coughing')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR COUGH:**
... (same detailed cough response) ...`,
      confidence: 0.88,
      sources: ['American Lung Association', 'American College of Chest Physicians', 'Mayo Clinic'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  if (lowerInput.includes('stomach') || lowerInput.includes('nausea') || lowerInput.includes('vomit') || lowerInput.includes('abdominal')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR STOMACH/NAUSEA:**
... (same detailed stomach/nausea response) ...`,
      confidence: 0.87,
      sources: ['American Gastroenterological Association', 'CDC', 'Mayo Clinic'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  if (lowerInput.includes('tired') || lowerInput.includes('fatigue') || lowerInput.includes('exhausted') || lowerInput.includes('weak')) {
    return {
      answer: `**POSSIBLE CONDITIONS FOR FATIGUE:**
... (same detailed fatigue response) ...`,
      confidence: 0.85,
      sources: ['American Academy of Sleep Medicine', 'National Heart, Lung, and Blood Institute', 'Mayo Clinic'],
      disclaimer: 'This information is for educational purposes only. Consult a healthcare provider for proper diagnosis and treatment.'
    };
  }

  // Generic response for unrecognized symptoms if none of the above specific keywords match
  return {
    answer: `**SYMPTOM ANALYSIS NEEDED**

I need more specific information to provide possible conditions. Please describe:

**🔍 WHAT TO INCLUDE:**
• **Specific symptoms** - What exactly are you feeling?
• **Location** - Where in your body? (e.g., head, chest, left arm, right leg)
• **Duration** - How long have you had this?
• **Severity** - Rate pain/discomfort 1-10
• **Triggers** - What makes it better or worse?
• **Associated symptoms** - Any other symptoms you've noticed?

**📝 EXAMPLE DESCRIPTIONS:**
• "Sharp chest pain when breathing deeply for 2 days"
• "Throbbing headache on left side with nausea for 6 hours"
• "Persistent dry cough for 2 weeks, worse at night"
• "Severe abdominal pain in lower right side since this morning"
• "Fatigue and weakness for a month, even with sleep"

**💡 COMMON SYMPTOM CATEGORIES:**
Try describing symptoms like:
• Headache, migraine, head pain
• Dizziness, vertigo, lightheadedness
• Fever, chills, temperature
• Cough, breathing problems
• Stomach pain, nausea, vomiting, abdominal pain
• Fatigue, tiredness, weakness
• Chest, heart palpitations
• Back, joint, muscle aches
• Arm, leg, foot

Please provide more details about your specific symptoms for better guidance.`,
    confidence: 0.70,
    sources: ['General Medical Guidelines'],
    disclaimer: 'This information is for educational purposes only. Always consult with healthcare professionals for medical concerns.'
  };
};