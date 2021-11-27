const { createClient } = require("@supabase/supabase-js")
const { embed } = require("../embed.js")

const { throwError } = require("../../config.json")

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

invalidSyntax = "Invalid syntax, type `'help command` for full instruction "

const findOne = async (name) => {
  try {
    const { data, error } = await supabase
      .from("command")
      .select("*")
      .eq("name", name)

    if (error) {
      console.error(error)
      return throwError
    } else {
      return data
    }
  } catch (error) {
    console.error(error)
    return throwError
  }
}

showAll = async () => {
  try {
    const { data, error } = await supabase.from("command").select()

    if (error) {
      console.error(error)
      return throwError
    } else {
      const content = data.map((c, i) => `${i + 1}. ${c.name}`)

      const listEmbed = embed({
        author: "false",
        title: "List of Commands",
        content: content,
        footer: false,
      })

      return listEmbed
    }
  } catch (error) {
    console.error(error)
    return throwError
  }
}

addNew = async (keyword, message) => {
  //! Find if exist

  const isAvailable = await checkNotExist(keyword)

  //? Catch error
  if (typeof isAvailable === "string") return isAvailable

  //! If not exist then start adding
  if (isAvailable) {
    //? Invalid syntax
    if (!message || !message?.length || message.length === 0) {
      return invalidSyntax
    }

    //? Adding process
    try {
      const { error } = await supabase
        .from("command")
        .insert([{ name: keyword, response: message, rank: 1 }])

      if (error) {
        console.error(error)
        return throwError
      }
      return `Command ${keyword} has been successfully added ✅`
    } catch (error) {
      console.error(error)
      return throwError
    }
  }

  return `This command has already been added, ** try a different name or edit/delete it** ❌`
}

editCommand = async (keyword, message) => {
  //! Find if exist

  const notExist = await checkNotExist(keyword)

  //? Catch error
  if (typeof notExist === "string") return notExist

  //! If not exist then start adding
  if (!notExist) {
    console.log(message)

    //? Invalid syntax
    if (!message || !message?.length || message.length === 0) {
      return invalidSyntax
    }

    //? Adding process
    try {
      const { data, error } = await supabase
        .from("command")
        .update({ response: message })
        .match({ name: keyword })

      if (error) {
        console.error(error)
        return throwError
      }
      return `Command \`${keyword}\` has been successfully edited ✅`
    } catch (error) {
      console.error(error)
      return throwError
    }
  }

  return `This command has not been added, **try adding before editing it** ❌`
}

deleteCommand = async (keyword) => {
  const { data, error } = await supabase
    .from("command")
    .delete()
    .match({ name: keyword })

  if (error) return error

  return `Command ${keyword} has been successfully deleted ✅`
}

checkNotExist = async (keyword) => {
  try {
    const { data: foundItems, errorFind } = await supabase
      .from("command")
      .select()
      .eq("name", keyword)

    if (errorFind) {
      console.error(errorFind)
      return throwError
    }

    if (foundItems.length > 0) {
      //! If exist then return error
      return false
    }
  } catch (error) {
    console.error(error)
    return throwError
  }

  return true
}

module.exports.findOne = findOne
module.exports.showAll = showAll
module.exports.addNew = addNew
module.exports.editCommand = editCommand
module.exports.deleteCommand = deleteCommand
module.exports.invalidSyntax = invalidSyntax
