export const transformStudent = async (student) => {
    return {
        id: student.id,
        name: student.name,
        email: student.email,
        age: student.age,
        country: student.country ?? "",
        subjects: await Promise.all(
            student.Subjects.map(async (subject) => await transformSubject(subject))
        )
    }
}

export const transformSubject = async (Subject) => {
    return {
        id: Subject.id,
        name: Subject.name,
        description: Subject.description
    }
}