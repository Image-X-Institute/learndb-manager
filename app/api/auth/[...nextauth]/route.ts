import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = { id: 1, name: "J Smith", email: "a@a.com" }
        if (user) {
          return user
        } else {
          return null
        }

      },
    })
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
});

export { handler as GET, handler as POST };