import { createDummyScripts } from "./seed-scripts";
import { createDummyUserScriptsStars, createDummyUserTemplatesStars } from "./seed-stars";
import { createDummyTemplates } from "./seed-templates";
import { createDummyUsers } from "./seed-users";

async function main() {
    await createDummyUsers()
    await createDummyScripts()
    await createDummyTemplates()
    await createDummyUserTemplatesStars()
    await createDummyUserScriptsStars()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
