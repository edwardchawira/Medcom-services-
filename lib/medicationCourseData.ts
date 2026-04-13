// @ts-nocheck
/**
 * Medcom: "Prompting and assisting with medication in Home Care"
 * sourcePublicUrl: https://academy.florence.co.uk/public/courses/prompting-and-assisting-with-medication-in-home-care-43703b95-bdfa-4f0d-b07d-96794ec63da9
 * Intro chapter (ch1) aligns with supplied Florence Academy intro PDF; Medcom branding and links verified where possible.
 */
export const medicationCourse = {
  courseTitle: "Prompting and assisting with medication in Home Care",
  learningOutcomes: [
    "Explain prompting and assisting with medication and how this differs from medication administration.",
    "Explain the role of a care assistant in medication support in home care within the limits of your role.",
    "Recognise when a service user may require prompting or assistance within the limits of your role.",
    "Recognise possible signs of side-effects and adverse drug reactions.",
    "Identify appropriate responses if a service user refuses their medication.",
    "Use effective communication when discussing medicines with service users.",
    "Explain the importance of accurate medication records and documentation.",
    "Identify consequences of working outside the limitations of your role."
  ],
  chapters: [
    {
      id: 1,
      title: "Introduction",
      html: `
        <p class="text-sm font-semibold text-teal-800 mb-2"><i class="fas fa-hand-sparkles mr-1"></i> Welcome</p>
        <p class="mb-4 text-gray-800">Welcome to the <strong>Medcom Prompting and assisting with medication in Home Care</strong> course. This module is designed to provide you with the essential knowledge required for the safe and effective practice of prompting and assisting with medication within home care in the UK. This course covers the basics you need to know to support service users to take medication in their homes. If you need a more in-depth course on medication administration, take the <strong>Medcom Medication Administration</strong> course (or your employer’s equivalent).</p>
        <p class="mb-6 text-sm text-gray-700 border-l-4 border-teal-500 pl-4">This course is CPD accredited, aligns with the relevant NICE guidelines, and meets the Skills for Care requirement for training in managing medication.</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-2"><i class="fas fa-users text-teal-600 mr-1"></i> Who is this course for?</h3>
        <p class="mb-4 text-gray-700">This course is suitable for anyone working in health or social care as it provides an overview of medicines management. It is particularly aimed at <strong>care assistants</strong>; if you are a <strong>nurse</strong> or a <strong>senior care assistant</strong> with delegated responsibilities to administer medication, it will still be relevant.</p>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-gray-800">
          <strong><i class="fas fa-home mr-1"></i> Setting:</strong> This course is relevant for people who deliver care in a service user’s home. We say <strong>Home Care</strong> in this course. This may also be called <strong>domiciliary care</strong> or <strong>live-in care</strong>.
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2"><i class="fas fa-ban text-red-600 mr-1"></i> What this course is not</h3>
        <p class="mb-4 text-gray-700">Most care workers are <strong>not</strong> permitted to administer medication. Only nurses and appropriately trained and competent care and medical professionals can administer medication. This module does <strong>not</strong> provide practical skills for medication administration; it is a <strong>theory</strong> course only. It is essential to complete practical training and be assessed as competent in medication administration before administering any medication.</p>
        <p class="mb-6 text-sm text-gray-600"><i class="far fa-clock mr-1"></i> <strong>Complete this course in:</strong> 20–30 minutes.</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-3">By the end of this course, you will be able to</h3>
        <ol class="list-decimal pl-6 space-y-2 text-gray-700 text-sm mb-6">
          <li>Explain prompting and assisting with medication and how this differs from medication administration.</li>
          <li>Explain the role of a care assistant in medication support in home care within the limits of your role.</li>
          <li>Recognise when a service user may require prompting or assistance within the limits of your role.</li>
          <li>Recognise possible signs of side-effects and adverse drug reactions.</li>
          <li>Identify appropriate responses if a service user refuses their medication.</li>
          <li>Use effective communication when discussing medicines with service users.</li>
          <li>Explain the importance of accurate medication records and documentation.</li>
          <li>Identify consequences of working outside the limitations of your role.</li>
        </ol>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Key guidance and further reading</h3>
        <ul class="list-disc pl-6 space-y-2 text-sm text-teal-800 mb-6 break-words">
          <li><a href="https://www.england.nhs.uk" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">NHS: medicines safety</a> (search your nation’s NHS for the latest programme)</li>
          <li><a href="https://www.legislation.gov.uk/ukpga/1968/67/contents" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">Medicines Act</a> (legislation overview)</li>
          <li><a href="https://www.rpharms.com/resources/professional-guidance-on-the-administration-of-medicines" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">Royal Pharmaceutical Society: professional guidance on administration of medicines</a></li>
          <li><a href="https://www.cqc.org.uk/guidance-providers/adult-social-care/medicines-management-social-care" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">CQC: medicines guidance for adult social care</a></li>
          <li><a href="https://careinspectorate.com/index.php/care-services/adult-care-services" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">Care Inspectorate (Scotland)</a></li>
          <li><a href="https://www.nice.org.uk/guidance/sc1" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">NICE: managing medicines in care homes (includes the “6 R’s”)</a></li>
          <li><a href="https://bnf.nice.org.uk/" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">BNF (NICE)</a></li>
          <li><a href="https://www.medicines.org.uk/emc" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">emc medicines compendium</a></li>
          <li><a href="https://www.cqc.org.uk/guidance-providers/adult-social-care/disposing-medicines" class="underline hover:text-teal-900" target="_blank" rel="noopener noreferrer">CQC: disposing of medicines</a></li>
        </ul>
        <details class="bg-teal-50 border border-teal-100 rounded-lg p-4">
          <summary class="font-semibold text-teal-900 cursor-pointer">Check understanding</summary>
          <p class="mt-3 text-sm text-gray-700">Why is this module described as theory only, and what must you complete before administering medication?</p>
        </details>`
    },
    {
      id: 2,
      title: "What are your responsibilities?",
      html: `
        <p class="text-xs text-gray-500 mb-4"><i class="far fa-clock mr-1"></i> About 4 minutes</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-3">At a glance</h3>
        <ul class="space-y-2 mb-6 text-gray-800 text-sm">
          <li class="flex gap-2"><span class="text-amber-500 font-bold">⚡</span><span><strong>Safety</strong> is vital when dealing with medicines. This resource does <strong>not</strong> replace existing guidance or specific medication training from your employer.</span></li>
          <li class="flex gap-2"><span class="text-amber-500 font-bold">⚡</span><span><strong>Prompting</strong>, <strong>assisting</strong>, and <strong>administering</strong> medication are different things.</span></li>
          <li class="flex gap-2"><span class="text-amber-500 font-bold">⚡</span><span>Medication is only ever <strong>administered</strong> by a designated, appropriately trained member of staff.</span></li>
          <li class="flex gap-2"><span class="text-amber-500 font-bold">⚡</span><span>There are important <strong>laws and guidance</strong> you need to follow when prompting or assisting with medication.</span></li>
        </ul>
        <div class="mb-6">
          <div class="p-1 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-400 to-indigo-400 shadow-sm">
            <div class="bg-white rounded-2xl overflow-hidden">
              <img
                src="/images/content/chapter-ch2-responsibilities-clay.png"
                alt="Clay-style illustration of a care worker in teal scrubs talking with an older adult at home"
                class="w-full h-64 sm:h-80 object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Home care often includes medicine reminders, packaging support, and careful documentation.</p>
        </div>
        <p class="mb-4 text-gray-800">As a <strong>home care assistant</strong>, you play a crucial role in the well-being of those you care for. This course is tailored to help you understand and effectively fulfil your responsibilities in medication support.</p>
        <p class="mb-4 text-gray-700">Most people receiving care in their own homes are prescribed medication at some time as part of their treatment by their doctor or nurse, and many have multiple medication needs. A <strong>medication</strong> is a drug used to diagnose, cure, treat, or prevent disease. A service user may be taking regular prescribed or non-prescribed medication.</p>
        <p class="mb-4 text-gray-700">While many service users manage their medication effectively themselves with appropriate support from informal carers, some ask for or need support with their medicines from their home care provider. Their needs can range from simple reminders and help with packaging through to actual administration of medication.</p>
        <p class="mb-4 text-gray-700">In some cases, this might include the administration of <strong>controlled drugs</strong>, which requires care workers to know how they are being safely stored and administered in the home setting.</p>
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-gray-800">
          <p class="font-semibold text-blue-900 mb-1"><i class="fas fa-lightbulb text-blue-600 mr-1"></i> Controlled drugs</p>
          <p>Controlled drugs are medications regulated by law (e.g. under the Misuse of Drugs Act) because of their potential for misuse. They are high-risk medicines. They include various substances, some used for medical treatment but needing strict control.</p>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">What do you need to know?</h3>
        <p class="mb-4 text-gray-700">Firstly, it is important to know the difference between <strong>prompting</strong>, <strong>assisting</strong> with, and <strong>administering</strong> medication.</p>
        <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 text-sm">
          <li><strong>Prompting</strong>: reminding or encouraging someone to take their medicine at the right time.</li>
          <li><strong>Assisting</strong>: helping them take their own medicine (e.g. opening packaging) without you administering it.</li>
          <li><strong>Administering</strong>: you give the medicine to the person. This is only for designated, trained staff.</li>
        </ul>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-gray-900">
          <strong>⚠</strong> Medication is only ever administered by a <strong>designated, appropriately trained</strong> member of staff.
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Laws and guidance</h3>
        <p class="mb-4 text-gray-700">In the UK, your role in medication support is guided by specific laws and guidelines. It is crucial that we operate within these legal boundaries to ensure the safety and rights of everyone involved. Key legislation and guidance include the <strong>Health and Social Care Act</strong> and guidance from organisations such as the <strong>CQC</strong> and <strong>NICE</strong>.</p>
        <p class="mb-4 text-gray-700">Understanding these guidelines helps protect service users and you as a care provider. It helps ensure care is safe, effective, and respectful of each person’s autonomy and dignity.</p>
        <p class="mb-6 text-sm text-gray-700 border-l-4 border-gray-300 pl-3"><strong>Autonomy</strong>: a person’s independence and freedom to make their own decisions.</p>
        <p class="text-gray-700 mb-6">During this course we explore these aspects in more detail so you can feel confident in your crucial role. Your work makes a significant difference; being well informed is key to doing it successfully.</p>
        <div class="mcq-root border-2 border-gray-200 rounded-xl p-5 bg-gray-50 mt-2">
          <p class="font-semibold text-gray-900 mb-1">Check your answer</p>
          <p class="text-sm text-gray-700 mb-4">What is usually <strong>not</strong> part of a home care assistant’s role in medication support?</p>
          <div class="space-y-2">
            <button type="button" class="mcq-opt w-full text-left px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-teal-50 hover:border-teal-300 text-sm text-gray-800 transition-colors" data-correct="true">Administering medication.</button>
            <button type="button" class="mcq-opt w-full text-left px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-teal-50 hover:border-teal-300 text-sm text-gray-800 transition-colors" data-correct="false">Reminding clients to take their medication.</button>
            <button type="button" class="mcq-opt w-full text-left px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-teal-50 hover:border-teal-300 text-sm text-gray-800 transition-colors" data-correct="false">Helping clients access their medicines.</button>
            <button type="button" class="mcq-opt w-full text-left px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-teal-50 hover:border-teal-300 text-sm text-gray-800 transition-colors" data-correct="false">Monitoring side effects of medications.</button>
          </div>
          <p class="mcq-feedback mt-3 text-sm min-h-[1.25rem] text-gray-600" aria-live="polite"
            data-msg-correct="Correct. Administering medication is only for designated, appropriately trained staff. It is not a routine part of most home care assistants’ roles."
            data-msg-wrong="Not quite. Try again. Think about which task requires specific training and delegation before you may perform it."></p>
        </div>`
    },
    {
      id: 3,
      title: "What is prompting and assisting with medication?",
      html: `
        <p class="mb-4"><strong>Prompting</strong> is reminding someone that it is time to take their medicine or helping them remember the process. <strong>Assisting</strong> is practical help so they can take it themselves, such as opening packaging or reading a label, while they remain in control.</p>
        <p class="mb-4 text-gray-700"><strong>Administration</strong> means you actually give the medicine (e.g. placing a tablet in the mouth). Only staff who are trained and authorised may administer.</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Why the distinction matters</h3>
        <p class="text-gray-700 mb-4">Getting it wrong can harm the person, break the law, or invalidate insurance. Always record what level of support you provided.</p>
        <details class="bg-teal-50 border border-teal-100 rounded-lg p-4">
          <summary class="font-semibold text-teal-900 cursor-pointer">Check understanding</summary>
          <p class="mt-3 text-sm text-gray-700">Opening a blister strip and handing the blister to the person to press a tablet out themselves: prompting, assisting, or administering?</p>
        </details>`
    },
    {
      id: 4,
      title: "Why may a person need assistance?",
      html: `
        <p class="mb-4">Needs vary. Common reasons include reduced dexterity or vision, tremor, pain, fatigue, memory problems, confusion, low mood, anxiety, language barriers, or a home environment that makes medicines hard to manage (poor light, complex packaging).</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Person-centred approach</h3>
        <p class="text-gray-700 mb-4">Ask what help they want, offer the <em>least</em> intrusive support that keeps them safe, and review when their condition changes.</p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li>Capacity and consent apply to accepting or refusing medicines.</li>
          <li>Document the support you give and any changes you observe.</li>
        </ul>`
    },
    {
      id: 5,
      title: "Understanding the needs of service users",
      html: `
        <p class="mb-4">Medicines support must fit the <strong>whole person</strong>: their routine, culture, beliefs, capacity, and communication needs. Listen, observe non-verbal cues, and adapt your pace.</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Communication</h3>
        <p class="text-gray-700 mb-4">Use clear, respectful language; check understanding; involve family or advocates when appropriate and agreed in the care plan.</p>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          <strong>Tip:</strong> If someone is anxious about side-effects, acknowledge their concern and follow policy for who can give clinical explanations (often the GP or nurse).
        </div>`
    },
    {
      id: 6,
      title: "How is medication stored in home care?",
      html: `
        <p class="mb-4">Store medicines as the label says and your policy requires: correct temperature, out of reach of children, and secure storage for controlled drugs. Keep original packs and pharmacy labels unless a formal system (e.g. dosette) is authorised.</p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li>Check expiry dates and look for damaged packaging.</li>
          <li>Report spoiled or missing stock according to procedure.</li>
        </ul>`
    },
    {
      id: 7,
      title: "What are adverse drug reactions (ADR) and drug interactions?",
      html: `
        <p class="mb-4">An <strong>ADR</strong> is harm linked to taking a medicine. <strong>Interactions</strong> can occur between medicines, or with food and drink. You are not expected to diagnose, but you <strong>observe</strong> and <strong>report</strong> concerns.</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">What to look for</h3>
        <p class="text-gray-700 mb-4">New rashes, swelling, breathing difficulty, sudden confusion, severe drowsiness, vomiting, or any rapid change after a new medicine should be reported urgently per policy.</p>
        <p class="text-sm text-gray-600">Escalation routes (on-call nurse, GP, 999) are defined locally. Never delay if you suspect an emergency.</p>`
    },
    {
      id: 8,
      title: "What about refusals?",
      html: `
        <p class="mb-4">If the person has <strong>capacity</strong>, their refusal must be respected. Do not pressure or disguise medicines. Record the refusal, time, and any reason given.</p>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Escalation</h3>
        <p class="text-gray-700 mb-4">Follow policy: there may be a risk assessment, GP review, or mental capacity process if there is concern they cannot understand the decision.</p>
        <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-gray-800">Never attempt to administer covertly unless there is a lawful, authorised plan. This is outside a standard prompting/assisting module.</div>`
    },
    {
      id: 9,
      title: "Documentation and record keeping",
      html: `
        <p class="mb-4">Accurate records protect the person and your team. Use the agreed system (MAR chart, app, or notes). Record what happened at the time, not hours later from memory.</p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li>Date, time, medicine, dose, route, and outcome (taken / refused / omitted and why).</li>
          <li>Any adverse events or advice given to the person.</li>
          <li>Never falsify entries or sign for someone else.</li>
        </ul>`
    },
    {
      id: 10,
      title: "Ordering, transporting, storing, and disposing",
      html: `
        <p class="mb-4">You may be involved in checking deliveries, moving medicines between rooms, or arranging disposal of waste. Follow infection control and medicines policy.</p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li>Dispose of medicines only through approved routes (pharmacy or community scheme).</li>
          <li>Sharps and CDs: strict local rules. Never guess.</li>
        </ul>`
    },
    {
      id: 11,
      title: "Ethical considerations",
      html: `
        <p class="mb-4">Respect autonomy, privacy, and equality. Do not judge someone’s choices; support informed decisions within the law. If you are asked to act unethically or outside scope, decline politely and escalate.</p>`
    },
    {
      id: 12,
      title: "Simple scenarios",
      html: `
        <p class="mb-4 font-medium text-gray-900">Scenario 1</p>
        <p class="mb-4 text-gray-700">A service user can swallow tablets but cannot peel a foil. You open the foil and they take the tablet from the blister. What kind of support is this?</p>
        <p class="mb-6 font-medium text-gray-900">Scenario 2</p>
        <p class="mb-4 text-gray-700">They say they feel sick after a new antibiotic. What do you do first after ensuring immediate safety?</p>
        <p class="text-sm text-gray-500">Compare answers in supervision; local policy is decisive.</p>`
    },
    {
      id: 13,
      title: "Summary",
      html: `
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Key takeaways</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Know prompting vs assisting vs administering.</li>
          <li>Stay inside role, policy, and care plan.</li>
          <li>Observe, communicate, document, escalate.</li>
        </ul>
        <p class="text-gray-700">You are ready to review and attempt the end-of-module check when your employer enables it.</p>`
    },
    {
      id: 14,
      title: "Review & Reflect",
      html: `
        <p class="mb-4">Take a few minutes: which learning outcome felt most challenging? What will you change on your next shift?</p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li>One strength you will keep</li>
          <li>One risk you will watch for</li>
          <li>One question for your supervisor</li>
        </ul>`
    },
    {
      id: 15,
      title: "🏆 What to expect from the assessment",
      html: `
        <p class="mb-4">The assessment tests whether you can apply these ideas to short scenarios, especially role limits, refusals, documentation, and when to escalate.</p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Read each question carefully; some have more than one correct theme.</li>
          <li>You can revisit chapters until you submit (where the platform allows).</li>
        </ul>
        <p class="text-gray-700">When ready, use <strong>Next</strong> to open the Assessment step.</p>`
    }
  ],
  assessmentHtml: `
    <p class="mb-4">This module supports continuing professional development where your employer recognises it. Medcom aligns content with common expectations for safe medicines support in social care; your organisation confirms how hours and certificates are recorded.</p>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Before you start</h3>
    <ul class="list-disc pl-6 space-y-2 mb-6 text-gray-700 text-sm">
      <li>Find a quiet space and allow enough time to finish in one sitting if required.</li>
      <li>Have your local policy or MAR example available if your assessor recommends it.</li>
    </ul>
    <h3 class="text-lg font-semibold text-gray-900 mb-3">Practice question (demo)</h3>
    <p class="text-sm text-gray-700 mb-3">Which action is <em>most</em> appropriate when a capacitous adult refuses a dose?</p>
    <div class="space-y-2 mb-6 text-sm">
      <label class="flex items-start gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"><input type="radio" name="demoq" class="mt-1" disabled /><span>Record the refusal and report per policy without pressuring them.</span></label>
      <label class="flex items-start gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"><input type="radio" name="demoq" class="mt-1" disabled /><span>Hide the tablet in food so they take it anyway.</span></label>
    </div>
    <div class="bg-gray-100 rounded-lg p-6 text-center">
      <p class="text-gray-600 mb-4">Live question bank and scoring connect here in production.</p>
      <button type="button" disabled class="px-6 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed font-semibold">Submit assessment (demo)</button>
    </div>`
};
