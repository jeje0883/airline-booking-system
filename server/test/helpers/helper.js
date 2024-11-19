function generateRandomProfile() {
    const firstNames = [
        "John", "Jane", "Alex", "Emily", "Chris", "Katie",
        "Michael", "Sarah", "David", "Laura", "James", "Olivia",
        "Liam", "Emma", "Noah", "Sophia", "Ethan", "Isabella",
        "Mason", "Ava", "Logan", "Mia", "Lucas", "Amelia",
        "Benjamin", "Charlotte", "Jacob", "Harper", "Henry", "Ella",
        "Elijah", "Abigail", "Daniel", "Avery", "Matthew", "Scarlett",
        "Jackson", "Sofia", "Sebastian", "Chloe", "Aiden", "Luna",
        "Oliver", "Evelyn", "Wyatt", "Hannah", "Carter", "Ellie",
        "Nathan", "Zoey", "Gabriel", "Nora", "Samuel", "Lily",
        "Jack", "Hazel", "Grayson", "Madison", "Isaac", "Aria",
        "Owen", "Addison", "Levi", "Eleanor", "Caleb", "Layla",
        "Julian", "Penelope", "Ryan", "Lillian", "Hunter", "Paisley",
        "Anthony", "Savannah", "Dylan", "Brooklyn", "Andrew", "Skylar",
        "Zane", "Nina", "Theo", "Riley", "Miles", "Elena",
        "Eli", "Aurora", "Aaron", "Naomi", "Adrian", "Camila",
        "Colton", "Delilah", "Asher", "Isla", "Dominic", "Victoria",
        "Ezekiel", "Violet", "Parker", "Zara", "Beau", "Quinn",
        "Jonah", "Georgia", "Finn", "Margaret", "Micah", "Athena",
        "Malachi", "Freya", "Ezra", "Jade", "Ronan", "Vivian",
        "Theo", "Maddox", "Griffin", "Annabelle", "Phoebe", "Cassidy",
        "Wesley", "Genevieve", "Kai", "Serenity", "August", "Nova",
        "Hugo", "Emerson", "Tobias", "Clara", "Archer", "Daphne",
        "Jasper", "Lucille", "Reid", "Iris", "Sterling", "Mabel",
        "Bodhi", "Elise", "Silas", "Ophelia", "Eden", "Maeve"
    ];
    

    const lastNames = [
        "Smith", "Johnson", "Brown", "Taylor", "Anderson",
        "Thomas", "Jackson", "White", "Harris", "Martin",
        "Thompson", "Garcia", "Martinez", "Robinson", "Clark",
        "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
        "Allen", "Young", "Hernandez", "King", "Wright",
        "Lopez", "Hill", "Scott", "Green", "Adams",
        "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell",
        "Perez", "Roberts", "Turner", "Phillips", "Campbell",
        "Parker", "Evans", "Edwards", "Collins", "Stewart",
        "Sanchez", "Morris", "Rogers", "Reed", "Cook",
        "Morgan", "Bell", "Murphy", "Bailey", "Rivera",
        "Cooper", "Richardson", "Cox", "Howard", "Ward",
        "Torres", "Peterson", "Gray", "Ramirez", "James",
        "Watson", "Brooks", "Kelly", "Sanders", "Price",
        "Foster", "Barnes", "Ross", "Henderson", "Coleman",
        "Jenkins", "Perry", "Powell", "Long", "Patterson",
        "Hughes", "Flores", "Washington", "Butler", "Simmons",
        "Fisher", "Gonzales", "Bryant", "Alexander", "Russell",
        "Griffin", "Diaz", "Hayes", "Myers", "Ford",
        "Hamilton", "Graham", "Sullivan", "Wallace", "Woods",
        "Cole", "West", "Jordan", "Owens", "Reynolds",
        "Fowler", "Harper", "Burke", "Ortiz", "Castro",
        "Murray", "Kim", "Gibbs", "Newton", "Webb",
        "Vargas", "Tucker", "Hunter", "Carlson", "Love",
        "Francis", "Holland", "Gibson", "Ford", "Griffith",
        "Carroll", "Carr", "Clayton", "Hubbard", "Lane",
        "Douglas", "Alvarez", "Jennings", "Franklin", "Mendez"
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
