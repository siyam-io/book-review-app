import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const realNames = [
  "Liam Smith", "Emma Johnson", "Noah Williams", "Olivia Brown", "William Jones",
  "Ava Garcia", "James Miller", "Isabella Davis", "Sophia Rodriguez", "Benjamin Martinez",
  "Mia Hernandez", "Lucas Lopez", "Charlotte Gonzalez", "Alexander Wilson", "Amelie Anderson",
  "Ethan Thomas", "Eleanor Taylor", "Daniel Moore", "Emily Jackson", "Matthew Martin",
  "Henry Lee", "Evelyn Perez", "Jacob Thompson", "Abigail White", "Michael Harris",
  "Harper Sanchez", "Logan Clark", "Sofia Ramirez", "Daniel Lewis", "Isla Robinson"
];

const realBooks = [
  {
    title: "The Hobbit",
    caption: "A legendary fantasy adventure about Bilbo Baggins' epic quest.",
    details: "Written by J.R.R. Tolkien, this classic fantasy novel follows the journey of hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon. It serves as a prelude to the legendary Lord of the Rings trilogy.",
    image: "https://images.unsplash.com/photo-1629992101753-56d196c8acf4?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    caption: "The magical journey of a young wizard beginning his education at Hogwarts.",
    details: "J.K. Rowling's masterpiece introduces us to Harry Potter, an orphan who discovers on his eleventh birthday that he is a wizard. He is whisked away to Hogwarts School of Witchcraft and Wizardry.",
    image: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "To Kill a Mockingbird",
    caption: "A powerful story addressing racial injustice and childhood innocence in the American South.",
    details: "Harper Lee's Pulitzer Prize-winning novel is set in Maycomb, Alabama, during the Great Depression. It deals with serious issues of rape and racial inequality, seen through the eyes of young Scout Finch.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "1984",
    caption: "A chilling dystopian masterpiece exploring government surveillance and totalitarianism.",
    details: "George Orwell's classic dystopian novel describes a dystopian society under the tyranny of Big Brother. Winston Smith struggles with his secret rebellion against the Party.",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Great Gatsby",
    caption: "An iconic portrait of the Jazz Age, wealth, and unrequited love.",
    details: "F. Scott Fitzgerald's 1925 novel follows the mysterious millionaire Jay Gatsby and his obsession to reunite with his former love, Daisy Buchanan, in wealthy Long Island.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Pride and Prejudice",
    caption: "A romantic classic exploring pride, social classes, and misconceptions.",
    details: "Jane Austen's famous novel centers on the turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy, highlighting the importance of marrying for love rather than money.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Catcher in the Rye",
    caption: "A deeply moving exploration of teenage alienation and identity.",
    details: "J.D. Salinger's novel is narrated by Holden Caulfield, a disillusioned teenager wandering New York City after being expelled from his prep school.",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Lord of the Rings",
    caption: "An epic high-fantasy journey to destroy the One Ring and defeat Sauron.",
    details: "J.R.R. Tolkien's massive fantasy epic spans three volumes: The Fellowship of the Ring, The Two Towers, and The Return of the King. It is one of the best-selling novels ever written.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Animal Farm",
    caption: "A brilliant political satire on the corruption of power and revolution.",
    details: "George Orwell's satirical allegory tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where animals can be equal, free, and happy.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Fahrenheit 451",
    caption: "A gripping tale of a future where books are outlawed and systematically burned.",
    details: "Ray Bradbury's dystopian novel presents a future American society where books are outlawed and 'firemen' burn any that are found. Guy Montag is a fireman who begins to question his role.",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Book Thief",
    caption: "A touching story of a young girl's relationship with books in Nazi Germany.",
    details: "Markus Zusak's historical fiction is narrated by Death. It follows Liesel Meminger, a young girl living in Germany during World War II, who finds solace in stealing books.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Chronicles of Narnia",
    caption: "The magical adventures of children entering the parallel universe of Narnia.",
    details: "C.S. Lewis's classic collection of seven fantasy novels includes iconic titles like The Lion, the Witch and the Wardrobe, exploring themes of magic, destiny, and good versus evil.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Hunger Games",
    caption: "A survival drama set in a dystopian nation forced to participate in annual games.",
    details: "Suzanne Collins' high-stakes trilogy begins with Katniss Everdeen volunteering to take her sister's place in the Hunger Games, a televised fight to the death among teenagers.",
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Kite Runner",
    caption: "An emotional story of friendship, betrayal, and redemption in Afghanistan.",
    details: "Khaled Hosseini's debut novel tells the story of Amir, a young boy from Kabul, and his close friend Hassan. It spans decades of political turmoil in Afghanistan.",
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Fault in Our Stars",
    caption: "A heartbreaking romance between two young cancer patients.",
    details: "John Green's famous young adult novel follows Hazel Grace Lancaster, a sixteen-year-old with thyroid cancer, who meets and falls in love with Augustus Waters in a support group.",
    image: "https://images.unsplash.com/photo-1474932430478-367db2683dac?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Da Vinci Code",
    caption: "A fast-paced thriller solving secret codes and historical mysteries.",
    details: "Dan Brown's conspiracy thriller follows symbologist Robert Langdon and cryptologist Sophie Neveu as they investigate a murder in the Louvre Museum and discover a religious conspiracy.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Alchemist",
    caption: "An inspiring journey of a shepherd boy seeking his Personal Legend.",
    details: "Paulo Coelho's allegorical novel tells the story of Santiago, an Andalusian shepherd boy who travels to Egypt in search of worldly treasure, discovering self-wisdom along the way.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Little Prince",
    caption: "A poetic tale about life, love, and human nature.",
    details: "Antoine de Saint-Exupéry's classic novella follows a pilot stranded in the desert who meets a young prince who has fallen to Earth from a tiny asteroid.",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Girl with the Dragon Tattoo",
    caption: "A dark mystery thriller involving computer hacking and family secrets.",
    details: "Stieg Larsson's psychological thriller is the first of the Millennium series. It follows journalist Mikael Blomkvist and hacker Lisbeth Salander as they solve a decades-old disappearance.",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bb1e?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Life of Pi",
    caption: "An extraordinary tale of survival at sea with a Bengal tiger.",
    details: "Yann Martel's philosophical novel tells the story of Pi Patel, an Indian boy who survives 227 days castaway in the Pacific Ocean on a lifeboat with a tiger named Richard Parker.",
    image: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Shining",
    caption: "A chilling horror classic set in an isolated, haunted hotel.",
    details: "Stephen King's gothic horror novel follows Jack Torrance, an aspiring writer and recovering alcoholic, who accepts a job as the off-season caretaker of the historic Overlook Hotel.",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Dune",
    caption: "The legendary science-fiction epic of politics, religion, and power on Arrakis.",
    details: "Frank Herbert's sci-fi masterpiece is set in the far future amidst a feudal interstellar society. It follows Paul Atreides as his family accepts control of the desert planet Arrakis.",
    image: "https://images.unsplash.com/photo-1535663116935-e362bd959cf9?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Brave New World",
    caption: "A visionary dystopian novel describing a highly controlled society.",
    details: "Aldous Huxley's futuristic novel anticipates developments in reproductive technology, sleep-learning, and psychological manipulation to create an engineered, consumerist society.",
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Frankenstein",
    caption: "A timeless gothic novel exploring scientific ethics and creation.",
    details: "Mary Shelley's classic tells the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment, only to reject it.",
    image: "https://images.unsplash.com/photo-1518373714866-3f1478910eb0?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Dracula",
    caption: "The epistolary gothic masterpiece that defined vampire lore.",
    details: "Bram Stoker's 1897 novel introduces the vampire Count Dracula and details his attempt to move from Transylvania to England to find new blood and spread the undead curse.",
    image: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Picture of Dorian Gray",
    caption: "A philosophical novel about vanity, morality, and double lives.",
    details: "Oscar Wilde's only novel tells of a young man named Dorian Gray, the subject of a portrait by artist Basil Hallward, who sells his soul to keep his youthful beauty forever.",
    image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "A Game of Thrones",
    caption: "The epic fantasy novel starting the Song of Ice and Fire saga.",
    details: "George R.R. Martin's complex high fantasy novel introduces the noble houses of Westeros and their political struggles to win the Iron Throne, while an ancient threat rises in the north.",
    image: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Road",
    caption: "A post-apocalyptic journey of a father and son struggling to survive.",
    details: "Cormac McCarthy's Pulitzer Prize-winning novel details the grueling journey of a father and his young son over a period of several months across a burned, post-apocalyptic landscape.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Catch-22",
    caption: "A satirical historical novel illustrating the absurdity of war.",
    details: "Joseph Heller's satirical masterpiece is set during World War II, following Captain John Yossarian, a US Army Air Forces B-25 bombardier, and his attempts to stay alive.",
    image: "https://images.unsplash.com/photo-1533319417894-6fbb331e5533?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Sapiens",
    caption: "A brief history of humankind, from ancient times to the modern era.",
    details: "Yuval Noah Harari's international bestseller surveys the history of humankind from the evolutionary emergence of Homo sapiens in the Stone Age to the technological age.",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Educated",
    caption: "A powerful memoir of self-invention and overcoming a family's constraints.",
    details: "Tara Westover's memoir tells of her life growing up in a survivalist family in Idaho, with no birth certificate or formal education, and how she eventually earned a PhD from Cambridge.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Becoming",
    caption: "The deeply personal memoir of the former First Lady of the United States.",
    details: "Michelle Obama invites readers into her world, chronicling the experiences that have shaped her—from her childhood on the South Side of Chicago to her years executive working.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Atomic Habits",
    caption: "Practical advice on how to build good habits and break bad ones.",
    details: "James Clear's guide outlines a framework for self-improvement, using concepts from biology, psychology, and neuroscience to make good habits inevitable and bad habits impossible.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Silent Patient",
    caption: "A shocking psychological thriller about a woman who shoots her husband and stops speaking.",
    details: "Alex Michaelides' bestselling thriller revolves around Alicia Berenson, a famous painter who shoots her husband five times, and the psychotherapist determined to uncover her motive.",
    image: "https://images.unsplash.com/photo-1508921310245-b0b9b1bb363a?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Normal People",
    caption: "An intimate exploration of first love and how one person can change your life.",
    details: "Sally Rooney's award-winning novel follows the complicated relationship between Marianne Sheridan and Connell Waldron as they navigate high school and university life.",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Where the Crawdads Sing",
    caption: "A beautiful coming-of-age story mixed with a murder mystery in the North Carolina marshes.",
    details: "Delia Owens' smash-hit novel follows Kya Clark, the 'Marsh Girl' of Barkley Cove, who becomes the chief suspect in the sudden death of local celebrity Chase Andrews.",
    image: "https://images.unsplash.com/photo-1491845338269-4f53cba90a6c?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Midnight Library",
    caption: "A poignant novel about life choices, regrets, and what truly makes life worth living.",
    details: "Matt Haig's bestseller tells the story of Nora Seed, who finds herself in a library between life and death, where she can try out all the other lives she could have lived.",
    image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "A Thousand Splendid Suns",
    caption: "A breathtaking chronicle of thirty years of Afghan history through two women's lives.",
    details: "Khaled Hosseini's follow-up to The Kite Runner is an emotional saga of two generations of Afghan women brought together by war, marriage, and shared tragedy in Kabul.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Giver",
    caption: "A thought-provoking dystopian novel about memory, choice, and conformity.",
    details: "Lois Lowry's young-adult classic follows Jonas, an 11-year-old boy selected to inherit the role of Receiver of Memory in a seemingly utopian, yet emotionless society.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Odyssey",
    caption: "Homer's epic poem about Odysseus' ten-year journey home from the Trojan War.",
    details: "One of the foundation stones of Western literature, this epic poem follows Odysseus, king of Ithaca, as he battles mythical monsters, angry gods, and temptations to return home.",
    image: "https://images.unsplash.com/photo-1463320306972-3d9f731a554a?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Metamorphosis",
    caption: "Franz Kafka's absurd, tragic masterpiece about Gregor Samsa turning into an insect.",
    details: "Gregor Samsa wakes up one morning to find himself transformed into a giant insect. He struggles to adapt to his new body while his family reacts with horror and disgust.",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Gone Girl",
    caption: "A masterfully constructed psychological thriller about a marriage gone terribly wrong.",
    details: "Gillian Flynn's dark, twisty thriller starts on Nick Dunne's fifth wedding anniversary, when his wife Amy vanishes. Suspicion falls heavily on Nick as secrets emerge.",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bb1e?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "The Outsiders",
    caption: "A classic coming-of-age story about social cliques and teenage brotherhood.",
    details: "Written by S.E. Hinton when she was just a teenager, this novel focuses on the Greasers, a gang of tough teenagers, and their rivalry with the wealthy Socs.",
    image: "https://images.unsplash.com/photo-1518373714866-3f1478910eb0?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Lord of the Flies",
    caption: "A dark study of human nature when schoolboys are stranded on a deserted island.",
    details: "William Golding's Nobel Prize-winning novel explores the boundary between civilization and savagery, following a group of British boys who try to govern themselves with disastrous results.",
    image: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Jane Eyre",
    caption: "A passionate gothic romance following the life and independence of Jane Eyre.",
    details: "Charlotte Brontë's masterpiece follows Jane from her difficult childhood through her work as a governess at Thornfield Hall, where she falls in love with the brooding Mr. Rochester.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Wuthering Heights",
    caption: "An intense, destructive love story set on the Yorkshire moors.",
    details: "Emily Brontë's sole novel follows the intense, chaotic, and destructive relationship between Heathcliff, an orphan taken in by the Earnshaw family, and Catherine Earnshaw.",
    image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=400&auto=format&fit=crop",
    rating: 4
  },
  {
    title: "Crime and Punishment",
    caption: "A profound psychological study of guilt, redemption, and murder in Russia.",
    details: "Fyodor Dostoevsky's masterwork follows Rodion Raskolnikov, a poor former student in St. Petersburg, who plans and executes a scheme to kill a pawnbroker for her money.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "The Brothers Karamazov",
    caption: "A massive philosophical novel debating faith, doubt, and moral struggle.",
    details: "Fyodor Dostoevsky's final novel is a passionate philosophical drama set in 19th-century Russia, entering deeply into ethical debates of God, free will, and morality.",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "One Hundred Years of Solitude",
    caption: "The multi-generational saga of the Buendía family in Macondo.",
    details: "Gabriel García Márquez's magnum opus is a landmark of magical realism, telling the story of the rise and fall of the mythical town of Macondo through the Buendía family.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop",
    rating: 5
  },
  {
    title: "Little Women",
    caption: "The beloved story of four sisters growing up during the American Civil War.",
    details: "Louisa May Alcott's semi-autobiographical novel follows the lives of the four March sisters—Meg, Jo, Beth, and Amy—in New England, tracing their passage from childhood to womanhood.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop",
    rating: 5
  }
];

const seedDB = async () => {
  try {
    console.log("Connected to Neon SQL database for seeding...");

    // Delete existing data
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    console.log("Cleared existing users, books, likes, and comments");

    // Create 30 Users with real names
    const users = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    for (let i = 0; i < realNames.length; i++) {
      const name = realNames[i];
      const username = name.toLowerCase().replace(/\s+/g, '_');
      const user = await prisma.user.create({
        data: {
          username: username,
          email: `${username}@bookreview.com`,
          password: hashedPassword,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        }
      });
      users.push(user);
    }
    console.log("Created 30 users with real names successfully!");

    // Create 50 Real Books
    const books = [];
    for (let i = 0; i < realBooks.length; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const bookData = realBooks[i];
      const book = await prisma.book.create({
        data: {
          title: bookData.title,
          caption: bookData.caption,
          details: bookData.details,
          image: bookData.image,
          rating: bookData.rating,
          userId: randomUser.id
        }
      });
      books.push(book);
    }
    console.log(`Created ${books.length} real books successfully!`);

    // Create random likes and comments
    const commentsList = [
      "Wow, this looks like an amazing read!",
      "I read this last month and absolutely loved it.",
      "Added to my to-read list. Thanks for the recommendation!",
      "The plot twist in this book was unbelievable.",
      "Totally agree with the rating, a must-read!",
      "I found the writing style very engaging.",
      "Highly recommended for anyone looking for a thought-provoking book.",
      "The character development was outstanding.",
      "Not my typical genre but I'm glad I read it.",
      "A true masterpiece of literature."
    ];

    console.log("Seeding likes and comments...");
    for (const book of books) {
      // Seed 5-15 random likes per book
      const numLikes = Math.floor(Math.random() * 11) + 5;
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numLikes; j++) {
        await prisma.like.create({
          data: {
            userId: shuffledUsers[j].id,
            bookId: book.id
          }
        });
      }

      // Seed 2-6 random comments per book
      const numComments = Math.floor(Math.random() * 5) + 2;
      for (let k = 0; k < numComments; k++) {
        const commenter = users[Math.floor(Math.random() * users.length)];
        const text = commentsList[Math.floor(Math.random() * commentsList.length)];
        await prisma.comment.create({
          data: {
            text,
            userId: commenter.id,
            bookId: book.id
          }
        });
      }
    }

    console.log("Database seeded successfully with users, books, likes, and comments!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
