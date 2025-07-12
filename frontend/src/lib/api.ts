export async function generateLessonPlan(lessonPlanData: LessonPlanRequest): Promise<GeneratedLessonPlan> {
  try {
    const response = await fetch('http://localhost:8080/api/lesson-plans/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonPlanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate lesson plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw error;
  }
}