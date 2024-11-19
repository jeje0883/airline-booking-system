function generateRandomProfile() {
    const firstNames = [
        "John", "Jane", "Alex", "Emily", "Chris", "Katie",
        "Michael", "Sarah", "David", "Laura", "James", "Olivia",
        "Liam", "Emma", "Noah", "Sophia", "Ethan", "Isabella",
        "Mason", "Ava", "Logan", "Mia", "Lucas", "Amelia",
        "Benjamin", "Charlotte", "Jacob", "Harper", "Henry", "Ella",
        "Elijah", "Abigail", "Daniel", "Avery", "Matthew", "Scarlett",
        "Jackson", "Sofia", "Sebastian", "Chloe", "Aiden", "Luna"
    ];

    const lastNames = [
        "Smith", "Johnson", "Brown", "Taylor", "Anderson",
        "Thomas", "Jackson", "White", "Harris", "Martin",
        "Thompson", "Garcia", "Martinez", "Robinson", "Clark",
        "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
        "Allen", "Young", "Hernandez", "King", "Wright",
        "Lopez", "Hill", "Scott", "Green", "Adams",
        "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell"
    ];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Generate random phone number
    const randomPhoneNumber = `09${Math.floor(100000000 + Math.random() * 900000000)}`; // Ensures 11 digits starting with 09

    // Generate and return the complete profile
    return {
        firstName: randomFirstName,
        lastName: randomLastName,
        email: `${randomFirstName}${randomLastName}@mail.com`,
        phoneNo: randomPhoneNumber,
        password: '12345678'
    };
}

module.exports = generateRandomProfile;
