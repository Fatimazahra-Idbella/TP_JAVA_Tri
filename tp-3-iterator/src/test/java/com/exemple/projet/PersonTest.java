package com.exemple.projet;

import junit.framework.TestCase;

public class PersonTest extends TestCase {

    public void testEqualsAndHashCode() {
        // Création des objets Person
        Person person1 = new Person(1, "Alice");
        Person person2 = new Person(1, "Alice");
        Person person3 = new Person(2, "Bob");

        // Vérifie que deux personnes avec le même id sont égales
        assertEquals(person1, person2);

        // Vérifie que les hashCodes sont identiques pour des objets égaux
        assertEquals(person1.hashCode(), person2.hashCode());

        // Vérifie que deux personnes avec des ids différents ne sont pas égales
        assertNotSame(person1, person3);
    }

    public void testToString() {
        // Création de l'objet Person
        Person person = new Person(1, "Alice");
        String expected = "Person{id=1, name='Alice'}";

        // Vérifie que la méthode toString retourne le bon résultat
        assertEquals(expected, person.toString());
    }
}
