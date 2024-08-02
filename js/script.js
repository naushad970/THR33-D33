import { getSpacesAvailability, generateImage, generateMesh } from './api.js';


/****************************************************************************************
Language handler
****************************************************************************************/
// const user_language = navigator.language || navigator.userLanguage;
// var language = "en";
// if (user_language.includes("fr")) {
//     language = "fr";
// }


/****************************************************************************************
Update sheme based on user preference
****************************************************************************************/
function updateColorScheme(type) {
    const root = document.querySelector(':root')
    if (type === "light") {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }
}
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    updateColorScheme("light");
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const new_color_scheme = event.matches ? "dark" : "light";
    updateColorScheme(new_color_scheme);
});


/****************************************************************************************
Prompt presets list
****************************************************************************************/
const preset_list = [
    "A jazzy penguin, wearing a bow tie, with a saxophone",
    "A purple unicorn, sparkly mane, eating a rainbow cupcake",
    "A robot butler, silver, with a tray of martinis",
    "A whimsical dragon, polka dots, blowing bubbles",
    "A monocled octopus, reading a book, sipping tea",
    "A neon pink flamingo, roller skating, with sunglasses",
    "A sci-fi toaster, chrome finish, with laser toast",
    "A charming walrus, in a tuxedo, holding a rose",
    "A ninja sloth, black mask, wielding nunchucks",
    "A fancy ferret, top hat and cane, strutting",
    "A space hamster, in an astronaut suit, on the moon",
    "A mischievous raccoon, with a treasure map, wearing a pirate hat",
    "A geeky squirrel, oversized glasses, hacking a computer",
    "A flamboyant peacock, disco ball tail feathers, dancing",
    "A chameleon chef, changing colors, flipping pancakes",
    "A rockstar llama, with a mohawk, playing a guitar",
    "A retro robot, cassette player chest, doing the moonwalk",
    "A dapper fox, in a bowler hat, with a monocle",
    "A detective platypus, trench coat and magnifying glass, on a case",
    "A regal giraffe, wearing a crown, sipping a smoothie",
    "A circus elephant, balancing on a ball, with a clown nose",
    "A hipster owl, wearing a beanie, with a coffee cup",
    "A surfing penguin, catching a wave, with sunglasses",
    "A zen koala, meditating on a lily pad, with a serene smile",
    "A skateboarding tortoise, with a helmet, doing tricks",
    "A majestic stag, antlers adorned with fairy lights, in a forest",
    "A cosmic jellyfish, floating in space, with neon trails",
    "A mystical mermaid, with shimmering scales, holding a trident",
    "A whimsical whale, with a top hat, singing opera",
    "A vintage velociraptor, in a 1920s suit, with a pocket watch",
    "A quirky quokka, with a flower crown, holding a balloon",
    "A glam rock goldfish, in a fishbowl, with electric guitar",
    "A rainbow-colored sloth, hanging upside down, with a lollipop",
    "A sophisticated snake, in a suit, reading the Wall Street Journal",
    "A ballerina bear, in a tutu, doing pirouettes",
    "A punk rock panda, with a mohawk, playing drums",
    "A retro ray gun, with a colorful swirl, and sound effects",
    "A steampunk spider, with goggles, on a mechanical web",
    "A magical moose, with antlers that glow, in a misty forest",
    "A quirky quail, with a monocle, writing a novel",
    "A futuristic fridge, with a holographic interface, making smoothies",
    "A mystical phoenix, rising from the ashes, with rainbow feathers",
    "A rockabilly raccoon, with a pompadour, playing a double bass",
    "A dino detective, with a fedora and magnifying glass, solving mysteries",
    "A robot chef, with extendable arms, cooking gourmet meals",
    "A jazz-loving jaguar, with a saxophone, in a smoky club",
    "A whimsical wizard, with a sparkling wand, casting spells",
    "A cyberpunk snail, with neon shell, sliding through a city",
    "A groovy goat, with bell bottoms, dancing to disco",
    "A magical mermaid, with a treasure chest, in a coral reef",
    "A fancy flamingo, with a bow tie, drinking a martini",
    "A punk rock penguin, with a leather jacket, on a skateboard",
    "A mystical mushroom, with a fairy door, in an enchanted forest",
    "A robotic raccoon, with laser eyes, guarding a trash can",
    "A dapper dinosaur, with a top hat, sipping tea",
    "A zany zebra, with rainbow stripes, dancing in the rain",
    "A cosmic cat, with a spacesuit, floating in a galaxy",
    "A steampunk seahorse, with gears and cogs, in a bubble",
    "A groovy guinea pig, with sunglasses, playing the bongos",
    "A wizardly walrus, with a magic staff, casting spells",
    "A funky ferret, with a fedora, playing a saxophone",
    "A rainbow raccoon, with a paintbrush, creating art",
    "A mystical moose, with glowing antlers, in a foggy forest",
    "A quirky quokka, with a bow tie, holding a balloon",
    "A spacefaring sloth, with a jetpack, flying through stars",
    "A regal rabbit, with a crown, holding a scepter",
    "A dancing dodo, with a top hat, in a ballroom",
    "A robotic rabbit, with LED eyes, hopping through a field",
    "A whimsical wolf, with a monocle, howling at the moon",
    "A cosmic kangaroo, with a starry pouch, hopping through space",
    "A jazz-playing jaguar, with a saxophone, in a smoky club",
    "A futuristic fox, with a holographic tail, in a neon city",
    "A rockstar raccoon, with a guitar, performing on stage",
    "A magical meerkat, with a wizard hat, casting spells",
    "A whimsical walrus, with a monocle, balancing a beach ball",
    "A retro robot, with an 8-track player chest, doing the twist",
    "A groovy giraffe, with a headband, dancing to funk music",
    "A mystical mermaid, with glowing scales, in a moonlit ocean",
    "A punk rock penguin, with a leather jacket, playing bass",
    "A zany zebra, with rainbow stripes, prancing in a meadow",
    "A cosmic cat, with a spacesuit, floating among stars",
    "A steampunk squirrel, with gears and goggles, in a treehouse",
    "A groovy goat, with bell bottoms, jamming to disco tunes",
    "A wizardly wombat, with a magic staff, conjuring spells",
    "A rainbow raccoon, with a paintbrush, creating a mural",
    "A mystical moose, with glowing antlers, in a snowy forest",
    "A quirky quokka, with a bow tie, holding a cupcake",
    "A spacefaring sloth, with a jetpack, soaring through galaxies",
    "A regal rabbit, with a crown, sitting on a throne",
    "A dancing dodo, with a tutu, twirling in a ballroom",
    "A robotic rabbit, with LED ears, hopping through circuits",
    "A whimsical wolf, with a monocle, howling at the night sky",
    "A cosmic kangaroo, with a starry pouch, bouncing through constellations",
    "A jazz-loving jaguar, with a saxophone, playing smooth tunes",
    "A futuristic fox, with a holographic fur, in a neon-lit alley",
    "A rockstar raccoon, with a mohawk, rocking out on stage",
    "A magical meerkat, with a wizard robe, casting enchantments",
    "A whimsical walrus, with a monocle, balancing a beach ball",
    "A retro robot, with an 8-track player chest, doing the twist",
    "A groovy giraffe, with a headband, dancing to funk beats",
];


/****************************************************************************************
Root elements
****************************************************************************************/
const form_object = document.getElementById('form-data');

const form_container = document.querySelector('.form-container');
const form_settings_container = document.querySelector('.form-settings-container');
const form_settings_label = document.querySelector('.form-settings-label');

// const form_preset_container = document.querySelector('.form-preset-container');
const form_type_container = document.querySelector('.form-type-container');

const properties_container = document.querySelector('.properties-container');
const informations_container = document.querySelector('.informations-container');

const loader_container = document.querySelector('.loader-container');
const loader_label = document.querySelector('.loader-label');

const status_container = document.querySelector('.status-container');
const status_content = document.querySelector('.status-content');
const status_label = document.querySelector('.status-label');

const viewer_preview = document.querySelector('.viewer-preview');
const viewer_content = document.querySelector('.viewer-content');

let prompt_type = "type-text";

/****************************************************************************************
Form events
****************************************************************************************/
// Form
function toggleForm() {
    form_settings_container.classList.toggle('active');
    form_settings_label.classList.toggle('active');
    // form_type_container.classList.toggle('disabled');
}
form_settings_label.addEventListener('click', toggleForm);
form_settings_label.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        toggleForm();
    };
});
if ('ontouchstart' in document.documentElement) {
    form_settings_label.removeAttribute('tabindex');
}

// Presets
const preset_button = document.getElementById('preset-button');
preset_button.addEventListener('click', () => {
    const prompt = document.getElementById('prompt-text');
    const i = Math.floor(Math.random() * preset_list.length);
    prompt.value = preset_list[i];
});

// Types
function updateType(type) {
    prompt_type = type;
    const active_elements = document.querySelectorAll(`.form-${type}`);
    const elements = document.querySelectorAll('.form-input');
    elements.forEach(element => {
        element.classList.add('type-disabled');
        if (element.tagName === 'INPUT') {
            element.removeAttribute('required');
        }
    });
    active_elements.forEach(element => {
        element.classList.remove('type-disabled');
        if (element.tagName === 'INPUT') {
            element.setAttribute('required', '');
        }
    });
}
const form_type_items = document.querySelectorAll('.type-item');
form_type_items.forEach(item => {
    item.addEventListener('click', () => {
        form_type_items.forEach(item => {
            item.classList.remove('active');
        });
        item.classList.add('active');
        updateType(item.id);
    });
});

// Image input
const prompt_image_label = document.querySelector('label[for="prompt_image"]');
var prompt_image_input = document.getElementById('prompt_image');
prompt_image_input.value = '';
prompt_image_input.files = null;
prompt_image_label.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        prompt_image_label.click();
    };
});
function resetPromptImage() {
    prompt_image_input.remove();
    const input = document.createElement('input');
    input.id = 'prompt_image';
    input.name = 'prompt_image';
    input.type = 'file';
    input.accept = 'image/png, image/gif, image/jpeg';
    input.classList.add('form-input', 'form-type-image');
    input.value = '';
    input.setAttribute('required', '');
    prompt_image_label.before(input);
    prompt_image_input = input;
}
prompt_image_label.addEventListener('click', () => {
    if (prompt_image_input.classList.contains("active")) {
        prompt_image_input.classList.remove("active");
        resetPromptImage();
    } else {
        prompt_image_label.setAttribute('for', 'prompt_image');
        prompt_image_input.removeAttribute('disabled');
        prompt_image_input.click();
        prompt_image_input.addEventListener('change', () => {
            prompt_image_input.classList.add("active");
            const preview = prompt_image_label.querySelector('.input-preview-image');
            const object = URL.createObjectURL(prompt_image_input.files[0]);
            preview.style.backgroundImage = `url(${object})`;
        });
        prompt_image_input.setAttribute('disabled', '')
        prompt_image_label.removeAttribute('for');
        prompt_image_input.removeEventListener('change', () => {});
    }
    prompt_image_input.blur();
    prompt_image_label.blur();
});
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    document.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});
["dragenter", "dragover"].forEach(event => {
    prompt_image_label.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!prompt_image_input.classList.contains("active")) {
            prompt_image_label.classList.add('dragover');
        }
    });
});
prompt_image_label.addEventListener('dragleave', () => {
    prompt_image_label.classList.remove('dragover');
});
prompt_image_label.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    prompt_image_label.classList.remove('dragover');
    if (!prompt_image_input.classList.contains("active")) {
        prompt_image_input.classList.add("active");
        const preview = prompt_image_label.querySelector('.input-preview-image');
        preview.style.backgroundImage = `url(${URL.createObjectURL(event.dataTransfer.files[0])})`;
        prompt_image_input.files = event.dataTransfer.files;
        prompt_image_input.disabled = true;
    }
});


// Settings
const form_use_random_seed = document.getElementById('use_random_seed');
const form_seed = document.getElementById('seed');
form_use_random_seed.addEventListener('change', () => {
    form_seed.disabled = form_use_random_seed.checked;
});

const form_apply_refiner = document.getElementById('apply_refiner');
const form_num_inference_steps_refiner = document.getElementById('num_inference_steps_refiner');
const form_guidance_scale_refiner = document.getElementById('guidance_scale_refiner');
form_apply_refiner.addEventListener('change', () => {
    form_num_inference_steps_refiner.disabled = !form_apply_refiner.checked;
    form_guidance_scale_refiner.disabled = !form_apply_refiner.checked;
});

const form_checkboxes = document.querySelectorAll('input[type="checkbox"]');
form_checkboxes.forEach(checkbox => {
    const label = checkbox.previousElementSibling;
    checkbox.addEventListener('change', () => {
        label.classList.toggle('active');
    });
    if (checkbox.checked) {
        label.classList.add('active');
    }
});


/****************************************************************************************
Viewer container events
****************************************************************************************/
['mousedown', 'touchstart'].forEach(event => {
    viewer_content.addEventListener(event, () => {
        form_container.classList.add('blur');
        properties_container.classList.add('blur');
        status_container.classList.add('blur');
        if (form_settings_container.classList.contains('active')) {
            toggleForm();
        }
    });
});
['mouseup', 'touchend'].forEach(event => {
    viewer_content.addEventListener(event, () => {
        form_container.classList.remove('blur');
        properties_container.classList.remove('blur');
        status_container.classList.remove('blur');
    });
});


/****************************************************************************************
Status container events
****************************************************************************************/
status_label.addEventListener('mouseenter', () => {
    status_label.classList.add('active');
    status_content.classList.add('active');
});
status_container.addEventListener('mouseleave', () => {
    status_label.classList.remove('active');
    status_content.classList.remove('active');
});


/****************************************************************************************
Submit generation parameters to API
****************************************************************************************/
form_object.addEventListener('submit', async (event) => {
    event.preventDefault();

    function generateRandomSeed() {
        return Math.floor(Math.random() * 1000000);
    }

    // Get form data
    const form_data = new FormData(form_object);
    const data = Object.fromEntries(form_data.entries());

    for (const [key, value] of Object.entries(data)) {
        if (value === "on") {
            data[key] = true;
        } else if (value === "off") {
            data[key] = false;
        }
    }

    // Fix values
    const disabled_checkboxes = form_object.querySelectorAll('input[type="checkbox"]:not(:checked)');
    disabled_checkboxes.forEach(checkbox => {
        data[checkbox.name] = false;
    });

    const disabled_inputs = form_object.querySelectorAll('input[type="number"]:disabled');
    disabled_inputs.forEach(input => {
        data[input.name] = 10;
    });

    // Update display
    // form_preset_container.classList.add('disabled');
    form_type_container.classList.add('disabled');
    // refreshPresets();

    viewer_content.setAttribute('src', '');
    viewer_content.setAttribute('alt', '');
    viewer_content.classList.remove('active');

    properties_container.classList.remove('active');
    informations_container.classList.add('active');

    loader_container.classList.add('active');
    loader_container.classList.remove('static');
    loader_label.classList.add('pulse');

    const generate_button = document.getElementById('generate-button');
    generate_button.classList.add('active');
    generate_button.blur();

    const icon = generate_button.querySelector('.icon');
    icon.classList.remove('mdi-creation');
    icon.classList.add('mdi-loading');

    form_settings_label.blur();
    if (form_settings_container.classList.contains('active')) {
        toggleForm();
    }

    try {
        const prompt = data.additional_prompt !== "" ? data.prompt + ", " + data.additional_prompt : data.prompt;
        const negative_prompt = data.negative_prompt;
        const use_negative_prompt = negative_prompt !== "" ? true : false;
        const sample_steps = parseInt(data.sample_steps);
        const seed_value = data.use_random_seed ? generateRandomSeed() : parseInt(data.seed);
        const width = parseInt(data.width);
        const height = parseInt(data.height);
        const guidance_scale_base = parseFloat(data.guidance_scale_base);
        const guidance_scale_refiner = parseFloat(data.guidance_scale_refiner);
        const num_inference_steps_base = parseInt(data.num_inference_steps_base);
        const num_inference_steps_refiner = parseInt(data.num_inference_steps_refiner);
        const apply_refiner = data.apply_refiner || false;
        const api_key = data.hf_api_key;
        const model_image_sampler = data.image_sampler;
        const model_mesh_builder = data.mesh_builder;

        // Prompt type text: generate image
        if (prompt_type === "type-text") {
            // Update loader
            loader_label.textContent = "Sampling image...";
            generate_button.querySelectorAll('span')[0].textContent = "Generating (1/2)";

            // Generate image
            var image_url = await generateImage(
                api_key,
                prompt,
                negative_prompt,
                use_negative_prompt,
                seed_value,
                width,
                height,
                guidance_scale_base,
                guidance_scale_refiner,
                num_inference_steps_base,
                num_inference_steps_refiner,
                apply_refiner,
                model_image_sampler
            );
            // console.log("Generated Image URL:", image_url);
        } else
        
        // Prompt type image: load image
        if (prompt_type === "type-image") {
            // HOTFIX: Check if image is valid
            try {
                var image_url = URL.createObjectURL(prompt_image_input.files[0]);
            } catch (error){
                if (error instanceof TypeError) {
                    resetPromptImage();
                    throw new Error("Please select a valid image file");
                }
            }
        }

        // Update viewer
        viewer_preview.classList.add('loading');
        viewer_preview.style.backgroundImage = `url(${image_url})`;

        // Update loader
        loader_label.textContent = "Building mesh...";
        generate_button.querySelectorAll('span')[0].textContent = "Generating (2/2)";

        // Generate mesh
        const mesh_url = await generateMesh(
            api_key,
            image_url,
            sample_steps,
            seed_value,
            model_mesh_builder
        );
        // console.log("Generated Mesh:", mesh_url);

        // Store mesh
        const response = await fetch(mesh_url);
        const blob = await response.blob();
        const mesh = URL.createObjectURL(blob);

        // Update viewer
        viewer_content.setAttribute('src', mesh);
        viewer_content.setAttribute('alt', prompt);
        viewer_content.classList.add('active');

        // Create download button
        const weight = (blob.size / 1024 / 1024).toFixed(2);
        const download_button = document.getElementById('download-button');
        const new_download_button = download_button.cloneNode(true);
        download_button.parentNode.replaceChild(new_download_button, download_button);

        new_download_button.querySelectorAll('span')[0].textContent = `Download 3D Model (${weight} MB)`;
        new_download_button.addEventListener('click', () => {
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '').replace('T', '_').slice(0, -5);
            const a = document.createElement('a');
            a.href = mesh;
            a.download = `${timestamp}.glb`;
            a.click();
            a.remove();
        });
        
        // Update display
        loader_container.classList.remove('active');
        properties_container.classList.add('active');
        informations_container.remove('active');

    } catch (error) {
        console.error(error);
        
        // Display error message
        const message = error.message.replace(/['"]+/g, '');
        alert(`An error occurred:\n${message}`);
        
        // Reset display
        loader_container.classList.add('active');
        loader_container.classList.add('static');

        informations_container.classList.add('active');
        // form_preset_container.classList.remove('disabled');

    } finally {
        // Reset display
        form_type_container.classList.remove('disabled');
        
        loader_label.classList.remove('pulse');
        loader_label.textContent = "Write down a prompt to begin";

        generate_button.classList.remove('active');
        generate_button.querySelectorAll('span')[0].textContent = "Generate 3D Model";

        icon.classList.remove('mdi-loading');
        icon.classList.add('mdi-creation');

        viewer_preview.classList.remove('loading');
        viewer_preview.style.backgroundImage = 'none';
    }
});


/****************************************************************************************
Update the status of spaces on load
****************************************************************************************/
getSpacesAvailability().then((spaces_availability) => {
    const label = document.querySelector('#status-amount');

    while (status_content.firstChild) {
        status_content.removeChild(status_content.firstChild);
    }

    let i = 0;
    for (const space of spaces_availability) {

        const space_label = space.label;
        const space_url = space.url;
        const space_type = space.type;
        const space_key = space.key;
        const space_runtime = space.runtime;

        const status_item = document.createElement('div');
        status_item.classList.add('status-item');

        const status_item_link = document.createElement('a');
        status_item_link.href = space_url;
        status_item_link.target = '_blank';
        status_item_link.textContent = space_label;
        status_item.appendChild(status_item_link);

        const status_item_state = document.createElement('span');
        status_item_state.classList.add('status-item-state');

        status_item_state.textContent = space_runtime.replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        if (space_runtime === "RUNNING") {
            status_label.classList.remove('error');
            status_label.classList.add('success');
            status_item_state.classList.add('success');
            i++;
        } else {
            status_label.classList.remove('success');
            status_label.classList.add('error');
            status_item_state.classList.add('error');
        }

        if (status_item_state.classList.contains('success')) {
            const status_item_state_icon = document.createElement('span');
            status_item_state_icon.classList.add('mdi', 'mdi-fan', 'icon');
            status_item_state.appendChild(status_item_state_icon);
        }
        status_item.appendChild(status_item_state);
        
        status_content.appendChild(status_item);


        const select = document.getElementById(space_type);
        const option = document.createElement('option');
        option.value = space_key;
        option.textContent = space_label;
        select.appendChild(option);
    }

    label.textContent = i + '/' + spaces_availability.length;
});
