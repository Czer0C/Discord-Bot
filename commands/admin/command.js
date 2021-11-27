const {
  showAll,
  addNew,
  editCommand,
  deleteCommand,
  invalidSyntax,
} = require("../../utility/supabase")

module.exports = {
  name: "command",
  description: "Manage custom commands",
  adminOnly: true,
  staffOnly: true,
  usage: ` usage
    __command__ **list**
    __command__ **add** \`keyword\` \`link or text\`
    __command__ **edit** \`keyword\` \`link or text\`
    __command__ **delete** \`keyword\`
  `,
  async execute(message, args, client) {
    const { channel } = message

    const [action, keyword, ...rest] = args

    let response = invalidSyntax

    const output = rest?.join(" ")

    switch (action) {
      case "list":
        response = await showAll()
        break
      case "add":
        response = await addNew(keyword, output)
        break
      case "delete":
        response = await deleteCommand(keyword)
        break
      case "edit":
        response = await editCommand(keyword, output)
        break
      default:
        break
    }

    channel.send(response)
  },
}
