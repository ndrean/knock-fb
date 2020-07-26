# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
puts "cleaning"
User.destroy_all
puts "creating..."
User.create!(email:"toto@test.fr", name:"toto", password: "password")
User.create!(email:"t@test.fr", name:"t", password:"password")
puts "done!"