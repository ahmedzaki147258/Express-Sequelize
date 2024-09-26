export const transformUser = async (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        country: user.country ?? ""
    }
}