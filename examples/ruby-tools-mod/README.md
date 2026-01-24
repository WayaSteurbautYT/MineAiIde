# 💎 Ruby Tools Mod

**Created with MineAI IDE** — This example mod demonstrates what you can build using AI-powered code generation.

## What This Mod Adds

| Item | Description | Damage | Durability |
|------|-------------|--------|------------|
| 🗡️ Ruby Sword | Glowing red sword with fire aspect | 12 | 1500 |
| ⛏️ Ruby Pickaxe | Mines faster than diamond | - | 2000 |
| 💎 Ruby Gem | Base crafting material | - | - |
| 🧱 Ruby Block | Decorative storage block | - | - |
| 🌍 Ruby Ore | Spawns underground (Y 5-20) | - | - |

## How It Was Made

This entire mod was created by typing a single prompt into MineAI IDE:

```
Create a ruby tools mod with:
- A ruby gem item that drops from ruby ore
- Ruby ore that spawns between Y 5-20, rare like diamonds
- A ruby block for storage (9 gems = 1 block)
- A ruby sword with 12 damage, 1500 durability, and a red glow effect
- A ruby pickaxe that mines 20% faster than diamond
- Crafting recipes for all items
```

MineAI generated all the code below automatically!

---

## Generated Code

### Main Mod Class
`src/main/java/com/example/rubytools/RubyToolsMod.java`

```java
package com.example.rubytools;

import net.minecraft.world.item.*;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.MapColor;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

@Mod(RubyToolsMod.MOD_ID)
public class RubyToolsMod {
    public static final String MOD_ID = "rubytools";
    
    // Registries
    public static final DeferredRegister<Item> ITEMS = 
        DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);
    public static final DeferredRegister<Block> BLOCKS = 
        DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);
    
    // Custom Tier for Ruby Tools
    public static final Tier RUBY_TIER = new Tier() {
        @Override public int getUses() { return 1500; }
        @Override public float getSpeed() { return 9.6f; } // 20% faster than diamond (8.0)
        @Override public float getAttackDamageBonus() { return 4.0f; }
        @Override public int getLevel() { return 3; }
        @Override public int getEnchantmentValue() { return 12; }
        @Override public Ingredient getRepairIngredient() { 
            return Ingredient.of(ModItems.RUBY_GEM.get()); 
        }
    };
    
    public RubyToolsMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        
        // Register items and blocks
        ITEMS.register(modEventBus);
        BLOCKS.register(modEventBus);
        ModItems.register();
        ModBlocks.register();
        
        MinecraftForge.EVENT_BUS.register(this);
    }
}
```

### Items Registration
`src/main/java/com/example/rubytools/ModItems.java`

```java
package com.example.rubytools;

import net.minecraft.world.item.*;
import net.minecraftforge.registries.RegistryObject;

public class ModItems {
    
    // Ruby Gem - Base material
    public static final RegistryObject<Item> RUBY_GEM = RubyToolsMod.ITEMS.register(
        "ruby_gem",
        () -> new Item(new Item.Properties())
    );
    
    // Ruby Sword - 12 damage, glowing effect
    public static final RegistryObject<Item> RUBY_SWORD = RubyToolsMod.ITEMS.register(
        "ruby_sword",
        () -> new SwordItem(
            RubyToolsMod.RUBY_TIER,
            7, // 4 base + 7 = 11, plus 1 from tier = 12 total
            -2.4f,
            new Item.Properties()
        ) {
            @Override
            public boolean isFoil(ItemStack stack) {
                return true; // Makes it glow like enchanted items
            }
        }
    );
    
    // Ruby Pickaxe - 20% faster mining
    public static final RegistryObject<Item> RUBY_PICKAXE = RubyToolsMod.ITEMS.register(
        "ruby_pickaxe",
        () -> new PickaxeItem(
            RubyToolsMod.RUBY_TIER,
            1,
            -2.8f,
            new Item.Properties()
        )
    );
    
    // Block Item for Ruby Block
    public static final RegistryObject<Item> RUBY_BLOCK_ITEM = RubyToolsMod.ITEMS.register(
        "ruby_block",
        () -> new BlockItem(ModBlocks.RUBY_BLOCK.get(), new Item.Properties())
    );
    
    // Block Item for Ruby Ore
    public static final RegistryObject<Item> RUBY_ORE_ITEM = RubyToolsMod.ITEMS.register(
        "ruby_ore",
        () -> new BlockItem(ModBlocks.RUBY_ORE.get(), new Item.Properties())
    );
    
    public static void register() {
        // Called to trigger static initialization
    }
}
```

### Blocks Registration
`src/main/java/com/example/rubytools/ModBlocks.java`

```java
package com.example.rubytools;

import net.minecraft.util.valueproviders.UniformInt;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.DropExperienceBlock;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.MapColor;
import net.minecraftforge.registries.RegistryObject;

public class ModBlocks {
    
    // Ruby Block - Storage block
    public static final RegistryObject<Block> RUBY_BLOCK = RubyToolsMod.BLOCKS.register(
        "ruby_block",
        () -> new Block(BlockBehaviour.Properties.of()
            .mapColor(MapColor.COLOR_RED)
            .strength(5.0f, 6.0f)
            .requiresCorrectToolForDrops()
        )
    );
    
    // Ruby Ore - Spawns underground, drops ruby gems
    public static final RegistryObject<Block> RUBY_ORE = RubyToolsMod.BLOCKS.register(
        "ruby_ore",
        () -> new DropExperienceBlock(
            BlockBehaviour.Properties.of()
                .mapColor(MapColor.STONE)
                .strength(3.0f, 3.0f)
                .requiresCorrectToolForDrops(),
            UniformInt.of(3, 7) // XP drop range
        )
    );
    
    public static void register() {
        // Called to trigger static initialization
    }
}
```

### World Generation (Ore Spawning)
`src/main/java/com/example/rubytools/worldgen/ModOreGeneration.java`

```java
package com.example.rubytools.worldgen;

import com.example.rubytools.ModBlocks;
import net.minecraft.core.registries.Registries;
import net.minecraft.data.worldgen.BootstapContext;
import net.minecraft.resources.ResourceKey;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.tags.BlockTags;
import net.minecraft.world.level.levelgen.VerticalAnchor;
import net.minecraft.world.level.levelgen.feature.ConfiguredFeature;
import net.minecraft.world.level.levelgen.feature.Feature;
import net.minecraft.world.level.levelgen.feature.configurations.OreConfiguration;
import net.minecraft.world.level.levelgen.placement.*;
import net.minecraft.world.level.levelgen.structure.templatesystem.RuleTest;
import net.minecraft.world.level.levelgen.structure.templatesystem.TagMatchTest;

import java.util.List;

public class ModOreGeneration {
    
    public static final RuleTest STONE_REPLACEABLES = 
        new TagMatchTest(BlockTags.STONE_ORE_REPLACEABLES);
    
    // Ruby ore: spawns Y 5-20, vein size 4, 2 veins per chunk (rare like diamond)
    public static void registerConfiguredFeatures(BootstapContext<ConfiguredFeature<?, ?>> context) {
        context.register(
            ResourceKey.create(Registries.CONFIGURED_FEATURE, 
                new ResourceLocation("rubytools", "ruby_ore")),
            new ConfiguredFeature<>(Feature.ORE, new OreConfiguration(
                List.of(OreConfiguration.target(STONE_REPLACEABLES, 
                    ModBlocks.RUBY_ORE.get().defaultBlockState())),
                4 // Vein size
            ))
        );
    }
    
    public static void registerPlacedFeatures(BootstapContext<PlacedFeature> context) {
        context.register(
            ResourceKey.create(Registries.PLACED_FEATURE, 
                new ResourceLocation("rubytools", "ruby_ore")),
            new PlacedFeature(
                context.lookup(Registries.CONFIGURED_FEATURE)
                    .getOrThrow(ResourceKey.create(Registries.CONFIGURED_FEATURE, 
                        new ResourceLocation("rubytools", "ruby_ore"))),
                List.of(
                    CountPlacement.of(2), // 2 veins per chunk
                    InSquarePlacement.spread(),
                    HeightRangePlacement.triangle(
                        VerticalAnchor.absolute(5),  // Min Y
                        VerticalAnchor.absolute(20)  // Max Y
                    ),
                    BiomeFilter.biome()
                )
            )
        );
    }
}
```

---

## Crafting Recipes

### Ruby Sword
```
    R
    R
    S

R = Ruby Gem
S = Stick
```

### Ruby Pickaxe
```
R R R
  S
  S

R = Ruby Gem
S = Stick
```

### Ruby Block
```
R R R
R R R
R R R

R = Ruby Gem
→ Produces 1 Ruby Block
```

### Ruby Gem (from block)
```
B

B = Ruby Block
→ Produces 9 Ruby Gems
```

---

## Installation

1. Download `rubytools-1.0.0.jar` from releases
2. Place in your `.minecraft/mods` folder
3. Launch Minecraft with Forge 1.20.1

## License

MIT License - Created with MineAI IDE
