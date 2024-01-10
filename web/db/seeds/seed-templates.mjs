import { sql } from "@vercel/postgres";
import { BASE_SEED_INDEX } from "./constants.mjs";

async function createDummyTemplates() {
    const queryString = `INSERT INTO templates (id, name, public, owner_id, tags) VALUES
        (${BASE_SEED_INDEX}1, '@xDepcio/template1', true, ${BASE_SEED_INDEX}1, 'nextjs react typescript tailwind'),
        (${BASE_SEED_INDEX}2, '@xDepcio/template2', false, ${BASE_SEED_INDEX}1, 'express sequelize postgres socketio'),
        (${BASE_SEED_INDEX}3, '@xDepcio/template3', true, ${BASE_SEED_INDEX}1, 'python flask sql'),
        (${BASE_SEED_INDEX}4, '@xDepcio/template4', false, ${BASE_SEED_INDEX}1, 'express sql postgres'),
        (${BASE_SEED_INDEX}5, '@xDepcio/template5', true, ${BASE_SEED_INDEX}1, 'vue laravel mysql'),
        (${BASE_SEED_INDEX}6, '@xDepcio/template6', true, ${BASE_SEED_INDEX}1, 'django react postgresql'),
        (${BASE_SEED_INDEX}7, '@xDepcio/template7', true, ${BASE_SEED_INDEX}1, 'spring angular mongodb'),
        (${BASE_SEED_INDEX}8, '@xDepcio/template8', true, ${BASE_SEED_INDEX}1, 'ruby rails sqlite'),
        (${BASE_SEED_INDEX}9, '@xDepcio/template9', true, ${BASE_SEED_INDEX}1, 'nodejs express mongo'),
        (${BASE_SEED_INDEX}10, '@xDepcio/template10', true, ${BASE_SEED_INDEX}1, 'go echo sqlserver'),
        (${BASE_SEED_INDEX}11, '@xDepcio/template11', true, ${BASE_SEED_INDEX}1, 'php symfony mariadb'),
        (${BASE_SEED_INDEX}12, '@xDepcio/template12', true, ${BASE_SEED_INDEX}1, 'java vertx cassandra'),
        (${BASE_SEED_INDEX}13, '@xDepcio/template13', true, ${BASE_SEED_INDEX}1, 'rust actix graphql'),
        (${BASE_SEED_INDEX}14, '@xDepcio/template14', true, ${BASE_SEED_INDEX}1, 'kotlin ktor redis'),
        (${BASE_SEED_INDEX}15, '@xDepcio/template15', true, ${BASE_SEED_INDEX}1, 'elixir phoenix arangodb'),
        (${BASE_SEED_INDEX}16, '@xDepcio/template16', true, ${BASE_SEED_INDEX}1, 'swift vapor dynamodb'),
        (${BASE_SEED_INDEX}17, '@xDepcio/template17', true, ${BASE_SEED_INDEX}1, 'csharp aspnet neo4j'),
        (${BASE_SEED_INDEX}18, '@xDepcio/template18', true, ${BASE_SEED_INDEX}1, 'perl dancer elasticsearch'),
        (${BASE_SEED_INDEX}19, '@xDepcio/template19', true, ${BASE_SEED_INDEX}1, 'c++ cpprestsdk orientdb'),
        (${BASE_SEED_INDEX}20, '@xDepcio/template20', true, ${BASE_SEED_INDEX}1, 'javascript nextjs firebase'),
        (${BASE_SEED_INDEX}21, '@xDepcio/template21', true, ${BASE_SEED_INDEX}1, 'typescript nestjs rethinkdb'),
        (${BASE_SEED_INDEX}22, '@xDepcio/template22', true, ${BASE_SEED_INDEX}1, 'svelte kit couchdb'),
        (${BASE_SEED_INDEX}23, '@xDepcio/template23', true, ${BASE_SEED_INDEX}1, 'fsharp giraffe aerospike'),
        (${BASE_SEED_INDEX}24, '@xDepcio/template24', true, ${BASE_SEED_INDEX}1, 'haskell yesod etcd'),
        (${BASE_SEED_INDEX}25, '@xDepcio/template25', true, ${BASE_SEED_INDEX}1, 'clojure luminus rocksdb'),
        (${BASE_SEED_INDEX}26, 'template_1', True, ${BASE_SEED_INDEX}3, 'gallery dashboard'),
        (${BASE_SEED_INDEX}27, 'template_2', True, ${BASE_SEED_INDEX}1, 'gallery ecommerce website admin'),
        (${BASE_SEED_INDEX}28, 'template_3', True, ${BASE_SEED_INDEX}2, 'portfolio admin'),
        (${BASE_SEED_INDEX}29, 'template_4', False, ${BASE_SEED_INDEX}8, 'admin ecommerce website blog'),
        (${BASE_SEED_INDEX}30, 'template_5', True, ${BASE_SEED_INDEX}3, 'landing'),
        (${BASE_SEED_INDEX}31, 'template_6', True, ${BASE_SEED_INDEX}3, 'resume blog landing dashboard admin'),
        (${BASE_SEED_INDEX}32, 'template_7', False, ${BASE_SEED_INDEX}2, 'website resume admin ecommerce'),
        (${BASE_SEED_INDEX}33, 'template_8', False, ${BASE_SEED_INDEX}4, 'resume'),
        (${BASE_SEED_INDEX}34, 'template_9', False, ${BASE_SEED_INDEX}9, 'gallery'),
        (${BASE_SEED_INDEX}35, 'template_10', False, ${BASE_SEED_INDEX}3, 'admin landing'),
        (${BASE_SEED_INDEX}36, 'template_11', False, ${BASE_SEED_INDEX}7, 'dashboard'),
        (${BASE_SEED_INDEX}37, 'template_12', True, ${BASE_SEED_INDEX}1, 'resume gallery blog portfolio'),
        (${BASE_SEED_INDEX}38, 'template_13', False, ${BASE_SEED_INDEX}7, 'resume dashboard form landing'),
        (${BASE_SEED_INDEX}39, 'template_14', True, ${BASE_SEED_INDEX}9, 'website form dashboard admin ecommerce'),
        (${BASE_SEED_INDEX}40, 'template_15', False, ${BASE_SEED_INDEX}8, 'resume form dashboard'),
        (${BASE_SEED_INDEX}41, 'template_16', True, ${BASE_SEED_INDEX}7, 'gallery admin landing blog'),
        (${BASE_SEED_INDEX}42, 'template_17', True, ${BASE_SEED_INDEX}10, 'landing dashboard portfolio'),
        (${BASE_SEED_INDEX}43, 'template_18', True, ${BASE_SEED_INDEX}7, 'landing gallery'),
        (${BASE_SEED_INDEX}44, 'template_19', True, ${BASE_SEED_INDEX}4, 'website'),
        (${BASE_SEED_INDEX}45, 'template_20', True, ${BASE_SEED_INDEX}6, 'resume'),
        (${BASE_SEED_INDEX}46, 'template_21', False, ${BASE_SEED_INDEX}9, 'portfolio form resume website blog'),
        (${BASE_SEED_INDEX}47, 'template_22', False, ${BASE_SEED_INDEX}10, 'portfolio resume website blog dashboard'),
        (${BASE_SEED_INDEX}48, 'template_23', False, ${BASE_SEED_INDEX}8, 'admin gallery portfolio landing dashboard'),
        (${BASE_SEED_INDEX}49, 'template_24', True, ${BASE_SEED_INDEX}3, 'dashboard'),
        (${BASE_SEED_INDEX}50, 'template_25', True, ${BASE_SEED_INDEX}2, 'ecommerce'),
        (${BASE_SEED_INDEX}51, 'template_26', True, ${BASE_SEED_INDEX}4, 'website resume ecommerce landing portfolio'),
        (${BASE_SEED_INDEX}52, 'template_27', True, ${BASE_SEED_INDEX}5, 'gallery admin'),
        (${BASE_SEED_INDEX}53, 'template_28', False, ${BASE_SEED_INDEX}8, 'resume ecommerce form'),
        (${BASE_SEED_INDEX}54, 'template_29', False, ${BASE_SEED_INDEX}1, 'portfolio'),
        (${BASE_SEED_INDEX}55, 'template_30', False, ${BASE_SEED_INDEX}5, 'ecommerce admin'),
        (${BASE_SEED_INDEX}56, 'template_31', True, ${BASE_SEED_INDEX}10, 'website form'),
        (${BASE_SEED_INDEX}57, 'template_32', True, ${BASE_SEED_INDEX}1, 'website form portfolio gallery ecommerce'),
        (${BASE_SEED_INDEX}58, 'template_33', False, ${BASE_SEED_INDEX}5, 'resume form'),
        (${BASE_SEED_INDEX}59, 'template_34', False, ${BASE_SEED_INDEX}4, 'form blog portfolio dashboard admin'),
        (${BASE_SEED_INDEX}60, 'template_35', True, ${BASE_SEED_INDEX}5, 'ecommerce'),
        (${BASE_SEED_INDEX}61, 'template_36', False, ${BASE_SEED_INDEX}3, 'gallery resume website'),
        (${BASE_SEED_INDEX}62, 'template_37', False, ${BASE_SEED_INDEX}5, 'dashboard'),
        (${BASE_SEED_INDEX}63, 'template_38', False, ${BASE_SEED_INDEX}3, 'dashboard gallery portfolio admin'),
        (${BASE_SEED_INDEX}64, 'template_39', True, ${BASE_SEED_INDEX}6, 'portfolio'),
        (${BASE_SEED_INDEX}65, 'template_40', True, ${BASE_SEED_INDEX}8, 'ecommerce gallery blog website'),
        (${BASE_SEED_INDEX}66, 'template_41', False, ${BASE_SEED_INDEX}1, 'dashboard resume landing ecommerce'),
        (${BASE_SEED_INDEX}67, 'template_42', False, ${BASE_SEED_INDEX}1, 'gallery'),
        (${BASE_SEED_INDEX}68, 'template_43', False, ${BASE_SEED_INDEX}4, 'website form gallery resume'),
        (${BASE_SEED_INDEX}69, 'template_44', False, ${BASE_SEED_INDEX}9, 'admin resume portfolio'),
        (${BASE_SEED_INDEX}70, 'template_45', True, ${BASE_SEED_INDEX}3, 'dashboard resume landing website'),
        (${BASE_SEED_INDEX}71, 'template_46', True, ${BASE_SEED_INDEX}10, 'gallery dashboard form portfolio website'),
        (${BASE_SEED_INDEX}72, 'template_47', True, ${BASE_SEED_INDEX}5, 'dashboard ecommerce'),
        (${BASE_SEED_INDEX}73, 'template_48', False, ${BASE_SEED_INDEX}1, 'form'),
        (${BASE_SEED_INDEX}74, 'template_49', False, ${BASE_SEED_INDEX}2, 'dashboard gallery portfolio landing'),
        (${BASE_SEED_INDEX}75, 'template_50', False, ${BASE_SEED_INDEX}10, 'form ecommerce landing website admin')
    ;`

    await sql.query(queryString)
}


async function main() {
    await createDummyTemplates()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
