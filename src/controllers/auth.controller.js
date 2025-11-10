const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  AuthRegisterSchema,
  AuthLoginSchema,
} = require("../schemas/api.schemas");

const SALT_ROUNDS = 10;
const SECRET = process.env.JWT_SECRET_KEY;

exports.register = async (req, res) => {
  try {
    AuthRegisterSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({
      message: "Validation error",
      errors: e.issues,
    });
  }

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: { id: true, email: true },
      });
      await tx.account.create({ data: { balance: 0, userId: user.id } });
      return user;
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already in use" });
    }
    console.error("Registration failed:", error);
    res
      .status(500)
      .json({ message: "Registration failed due to a server error." });
  }
};

exports.login = async (req, res) => {
  try {
    AuthLoginSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({
      message: "Validation error",
      errors: e.issues,
    });
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const access_token = jwt.sign({ userId: user.id }, SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", access_token });
};
