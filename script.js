document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lesson-form');
  const userPrompt = document.getElementById('user-prompt');
  const lessonOutput = document.getElementById('lesson-output');
  const tavusVideo = document.getElementById('tavus-video');
  const virtualBoard = document.getElementById('virtual-board');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = userPrompt.value.trim();
    if (!prompt) return;

    // Parse the prompt to extract user details
    const parsed = parsePrompt(prompt);
    if (!parsed) {
      alert('Please follow the prompt format: "I am [Name], teach me [Topic] in [Language]. I am in grade [Grade]."');
      return;
    }

    const { name, topic, language, grade } = parsed;

    // Prepare the request payload
    const payload = {
      topic,
      grade_level: grade,
      language,
      user_id: name
    };

    try {
      // Send request to backend
      const response = await fetch('https://ai-tutor-b8a6.onrender.com/lesson/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lesson data.');
      }

      const data = await response.json();

      // Display Tavus video
      tavusVideo.src = data.tavus_video_url;

      // Display virtual board content
      virtualBoard.innerHTML = '';
      data.live_teaching.forEach((item, index) => {
        setTimeout(() => {
          const line = document.createElement('div');
          line.innerHTML = `<span class="highlight">${item.text}</span>`;
          virtualBoard.appendChild(line);
        }, index * 2000); // Adjust timing as needed
      });

      lessonOutput.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching the lesson.');
    }
  });

  function parsePrompt(prompt) {
    // Simple regex to extract name, topic, language, and grade
    const regex = /I(?:'m| am) (\w+), teach me (.+?) in (\w+)\. I(?:'m| am) in grade (\d+)/i;
    const match = prompt.match(regex);
    if (!match) return null;
    return {
      name: match[1],
      topic: match[2],
      language: match[3],
      grade: match[4]
    };
  }
});
