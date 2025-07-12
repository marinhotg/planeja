export async function generateLessonPlan(lessonPlanData: LessonPlanRequest): Promise<GeneratedLessonPlan> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lesson-plans/generate`, {
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