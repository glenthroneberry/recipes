---
layout: default
title: Home
---

<link rel="stylesheet" href="{{ '/assets/style.css' | relative_url }}">

<header>
  <h1>{{ site.title }}</h1>
  <p>{{ site.description }}</p>
  <a href="{{ '/planner.html' | relative_url }}">Meal Planner &rarr;</a>
  <a href="{{ site.github_repo_url }}/issues/new?template=new_recipe.yml">+ Add a Recipe</a>
</header>

<main>
  {% for cat in site.category_order %}
    {% assign section = site.recipes | where: "category", cat %}
    {% if section.size > 0 %}
    <section class="recipe-section">
      <h2>{{ cat }}</h2>
      <ul class="recipe-list">
        {% for recipe in section %}
        <li>
          <a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a>
          {% if recipe.tags %}
          <span class="tags">
            {% for tag in recipe.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
          </span>
          {% endif %}
        </li>
        {% endfor %}
      </ul>
    </section>
    {% endif %}
  {% endfor %}

  {% assign grouped = site.recipes | group_by: "category" %}
  {% for group in grouped %}
    {% unless site.category_order contains group.name %}
    <section class="recipe-section">
      <h2>{{ group.name | default: "Other" }}</h2>
      <ul class="recipe-list">
        {% for recipe in group.items %}
        <li>
          <a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a>
          {% if recipe.tags %}
          <span class="tags">
            {% for tag in recipe.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
          </span>
          {% endif %}
        </li>
        {% endfor %}
      </ul>
    </section>
    {% endunless %}
  {% endfor %}
</main>
