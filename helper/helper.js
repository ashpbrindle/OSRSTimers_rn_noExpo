
export const findIcon = (item) => {
    switch(item.img) {
        case "img_acorn": return require("../assets/img_acorn_tree.png");
        case "img_willow": return require("../assets/img_willow_tree.png");
        case "img_maple": return require("../assets/img_maple_tree.png");
        case "img_yew": return require("../assets/img_yew_tree.png");
        case "img_magic": return require("../assets/img_magic_tree.png");
        case "img_apple": return require("../assets/img_apple_tree.png");
        case "img_banana": return require("../assets/img_banana_tree.png");
        case "img_orange": return require("../assets/img_orange_tree.png");
        case "img_curry": return require("../assets/img_curry_tree.png");
        case "img_pineapple": return require("../assets/img_pineapple_tree.png");
        case "img_papaya": return require("../assets/img_papaya_tree.png");
        case "img_palm": return require("../assets/img_palm_tree.png");
        case "img_dragonfruit": return require("../assets/img_dragonfruit_tree.png");
        case "img_teak": return require("../assets/img_teak_tree.png");
        case "img_mahogany": return require("../assets/img_mahogany_tree.png");
        case "img_calquat": return require("../assets/img_calquat_tree.png");
        case "img_crystal": return require("../assets/img_crystal_tree.png");
        case "img_celastrus": return require("../assets/img_celastrus_tree.png");
        case "img_redwood": return require("../assets/img_redwood_tree.png");
        case "img_birdhouse": return require("../assets/img_birdhouse.png")
        case "img_marigold": return require("../assets/img_marigold.png")
        case "img_rosemary": return require("../assets/img_rosemary.png")
        case "img_nasturtium": return require("../assets/img_nasturtium.png")
        case "img_woad": return require("../assets/img_woad.png")
        case "img_limpwurt": return require("../assets/img_limpwurt.png")
        case "img_white_lily": return require("../assets/img_white_lily.png")
        case "img_guam": return require("../assets/img_guam.png")
        case "img_marrentill": return require("../assets/img_marrentill.png")
        case "img_tarromin": return require("../assets/img_tarromin.png")
        case "img_harralander": return require("../assets/img_harralander.png")
        case "img_gout_tuber": return require("../assets/img_gout_tuber.png")
        case "img_ranarr": return require("../assets/img_ranarr.png")
        case "img_toadflax": return require("../assets/img_toadflax.png")
        case "img_irit": return require("../assets/img_irit.png")
        case "img_avantoe": return require("../assets/img_avantoe.png")
        case "img_kwuarm": return require("../assets/img_kwuarm.png")
        case "img_snapdragon": return require("../assets/img_snapdragon.png")
        case "img_cadantine": return require("../assets/img_cadantine.png")
        case "img_lantadyme": return require("../assets/img_lantadyme.png")
        case "img_dwarf_weed": return require("../assets/img_dwarf_weed.png")
        case "img_torstol": return require("../assets/img_torstol.png")
        case "img_barley": return require("../assets/img_barley.png")
        case "img_hammerstone": return require("../assets/img_hammerstone.png")
        case "img_asgarnian": return require("../assets/img_asgarnian.png")
        case "img_jute": return require("../assets/img_jute.png")
        case "img_yanillian": return require("../assets/img_yanillian.png")
        case "img_krandorian": return require("../assets/img_krandorian.png")
        case "img_wildblood": return require("../assets/img_wildblood.png")
        case "img_redberry": return require("../assets/img_redberry.png")
        case "img_cadavaberry": return require("../assets/img_cadavaberry.png")
        case "img_dwellberry": return require("../assets/img_dwellberry.png")
        case "img_jangerberry": return require("../assets/img_jangerberry.png")
        case "img_whiteberry": return require("../assets/img_whiteberry.png")
        case "img_poison_ivy": return require("../assets/img_poison_ivy.png")
        case "img_potato": return require("../assets/img_potato.png")
        case "img_onion": return require("../assets/img_onion.png")
        case "img_cabbage": return require("../assets/img_cabbage.png")
        case "img_tomato": return require("../assets/img_tomato.png")
        case "img_sweetcorn": return require("../assets/img_sweetcorn.png")
        case "img_strawberry": return require("../assets/img_strawberry.png")
        case "img_watermelon": return require("../assets/img_watermelon.png")
        case "img_snapegrass": return require("../assets/img_snapegrass.png")
        case "img_hespori": return require("../assets/img_hespori.png")
        default: break
    }
}

export const getDoubleNumber = (number) => {
    var return_value = ""
    number < 10 ? return_value = "0" + number : return_value = number
    return return_value
}