/**
 * Database Migration and Seeding Script for RamalTani
 * Creates tables and populates initial data in PostgreSQL
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, closePool } = require('./index');
const mockData = require('../data/mockData');

async function migrateAndSeed() {
  console.log('🚀 Starting PostgreSQL migration & seed for RamalTani...');

  try {
    // 1. Run Schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📋 Applying schema from schema.sql...');
    await query(schemaSql);
    console.log('✅ Schema tables verified/created successfully.');

    // 2. Seed Users
    console.log('🌱 Seeding users...');
    for (const u of mockData.users) {
      await query(
        `INSERT INTO users (id, name, email, phone, password_hash, role, location, latitude, longitude, commodity, land_size_ha, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           phone = EXCLUDED.phone,
           role = EXCLUDED.role,
           location = EXCLUDED.location,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           commodity = EXCLUDED.commodity,
           land_size_ha = EXCLUDED.land_size_ha;`,
        [
          u.id,
          u.name,
          u.email,
          u.phone || null,
          u.passwordHash || 'Demo1234!',
          u.role,
          u.location || null,
          u.latitude || null,
          u.longitude || null,
          u.commodity || null,
          u.landSize || null,
          u.isActive !== false,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.users.length} users.`);

    // 3. Seed Regions
    console.log('🌱 Seeding regions...');
    for (const r of mockData.regions) {
      await query(
        `INSERT INTO regions (id, name, province, latitude, longitude, adm4_code, area_label, main_crops, total_farmers, total_area_ha)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING;`,
        [
          r.id,
          r.name,
          r.province,
          r.latitude,
          r.longitude,
          r.adm4Code || null,
          r.area || null,
          r.mainCrops || [],
          r.totalFarmers || 0,
          r.totalArea || 0,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.regions.length} regions.`);

    // 4. Seed Crops
    console.log('🌱 Seeding crops...');
    for (const c of mockData.crops) {
      await query(
        `INSERT INTO crops (id, name, scientific_name, category, optimal_rainfall_mm_min, optimal_rainfall_mm_max, optimal_temp_c_min, optimal_temp_c_max, growing_period_days, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING;`,
        [
          c.id,
          c.name,
          c.scientificName || null,
          c.category || null,
          c.optimalRainfall ? c.optimalRainfall.min : null,
          c.optimalRainfall ? c.optimalRainfall.max : null,
          c.optimalTemp ? c.optimalTemp.min : null,
          c.optimalTemp ? c.optimalTemp.max : null,
          c.growingPeriodDays || null,
          c.description || null,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.crops.length} crops.`);

    // 5. Seed Varieties
    console.log('🌱 Seeding crop varieties...');
    for (const v of mockData.varieties) {
      await query(
        `INSERT INTO varieties (id, crop_id, crop_name, name, duration_days, potential_yield_ton_ha, resistance, description, recommended_season)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING;`,
        [
          v.id,
          v.cropId,
          v.cropName,
          v.name,
          v.durationDays || null,
          v.potentialYieldTonHa || null,
          v.resistance || [],
          v.description || null,
          v.recommendedSeason || null,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.varieties.length} varieties.`);

    // 6. Seed Planting History
    console.log('🌱 Seeding planting history...');
    for (const ph of mockData.plantingHistory) {
      await query(
        `INSERT INTO planting_history (id, farmer_id, crop_name, variety, planting_date, harvest_date, area_ha, status, yield_target_ton, yield_actual_ton, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING;`,
        [
          ph.id,
          ph.farmerId,
          ph.cropName,
          ph.variety || null,
          ph.plantingDate,
          ph.harvestDate || null,
          ph.areaHa || 1.0,
          ph.status || 'active',
          ph.yieldTargetTon || null,
          ph.yieldActualTon || null,
          ph.notes || null,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.plantingHistory.length} planting histories.`);

    // 7. Seed Risk Alerts
    console.log('🌱 Seeding risk alerts...');
    const alertsList = mockData.weatherAlerts || [];
    for (const a of alertsList) {
      await query(
        `INSERT INTO risk_alerts (id, title, description, level, region_name, latitude, longitude, action_advice, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING;`,
        [
          a.id,
          a.title,
          a.description || a.message || '',
          a.level || a.severity || 'waspada',
          a.regionName || a.region || 'Ngawi',
          a.latitude || null,
          a.longitude || null,
          a.actionAdvice || null,
          true,
        ]
      );
    }
    console.log(`✅ Seeded ${alertsList.length} risk alerts.`);

    // 8. Seed Community Posts
    console.log('🌱 Seeding community posts...');
    for (const p of mockData.communityPosts) {
      await query(
        `INSERT INTO community_posts (id, user_id, author_name, author_role, location, category, content, likes_count, comments_count, is_approved)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING;`,
        [
          p.id,
          p.userId || null,
          p.authorName,
          p.authorRole || 'Petani',
          p.location || null,
          p.category || 'Tanya Jawab',
          p.content,
          p.likesCount || p.likes || 0,
          p.commentsCount || (p.comments ? p.comments.length : 0),
          p.isApproved !== false,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.communityPosts.length} community posts.`);

    // 9. Seed Education Articles
    console.log('🌱 Seeding education articles...');
    for (const art of mockData.educationArticles) {
      await query(
        `INSERT INTO education_articles (id, title, category, reading_time, author, published_date, summary, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING;`,
        [
          art.id,
          art.title,
          art.category,
          art.readingTime || '5 menit',
          art.author,
          art.date || new Date().toISOString().split('T')[0],
          art.summary,
          art.content,
        ]
      );
    }
    console.log(`✅ Seeded ${mockData.educationArticles.length} education articles.`);

    console.log('\n🎉 RamalTani database migration & seed completed successfully on 192.168.1.8!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  migrateAndSeed();
}

module.exports = migrateAndSeed;
